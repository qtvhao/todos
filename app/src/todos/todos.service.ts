import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { ZanzibarService } from '../auth/zanzibar.service';
import { NotificationGateway } from '../notifications/notification/notification.gateway';
import { QueueService } from '../queue/queue.service';
import { Queue } from 'bull';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private queues: Queue[];

  constructor(
    private readonly queueService: QueueService,
    private readonly zanzibarService: ZanzibarService,
    private readonly notificationGateway: NotificationGateway,
  ) {
    this.queues = this.queueService.getQueues();
    this.queues.forEach((queue) => { queue.on('completed', (job) => this.onCompleted(job, queue)); });
    this.queues.forEach((queue) => { queue.process((job) => this.process(job)); });
    console.log('QueueProcessor initialized with queues:', this.queues.map((q) => q.name));
  }

  async process(job: any) {
      console.log('Processing job:', job.data);
      return { result: 'success' };
  }
  onCompleted(job: any, queue: Queue) {
      console.log('Job completed with result', job.returnvalue, 'from queue', queue.name);
      const todo = this.todos.find((t) => t.job_id === Number(job.id));
      console.log('Todo:', todo);
      if (todo) {
        this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is completed!`);
      }
  }

  async createTodo(
    accessKeyId: string,
    secretAccessKey: string,
    jobData: any,
  ): Promise<Todo | null> {
    const userId = await this.zanzibarService.getUserFromAccessKey(accessKeyId, secretAccessKey);

    if (!userId) throw new Error('Invalid access keys');

    let job = await this.queueService.addJob(jobData);
    const todo: Todo = {
      id: Date.now().toString(),
      job_id: Number(job.id),
      completed: false,
      userId,
    };
    console.log('Created todo:', todo);

    this.todos.push(todo);
    await this.zanzibarService.assignPermission(userId, 'read', todo.id);

    return todo;
  }

  async completeTodo(id: string, accessKeyId: string, secretAccessKey: string): Promise<Todo> {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) throw new NotFoundException('Todo not found');

    const hasPermission = await this.zanzibarService.checkPermission(
      accessKeyId,
      secretAccessKey,
      'read',
      todo.id,
    );

    if (!hasPermission) throw new Error('Unauthorized action');

    todo.completed = true;

    this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is completed!`);
    return todo;
  }
}
