import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { ZanzibarService } from '../auth/zanzibar.service';
import { NotificationGateway } from '../notifications/notification/notification.gateway';
import { QueueService } from '../queue/queue.service';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private queues: Queue[];
  private readonly logger = new Logger(TodosService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly zanzibarService: ZanzibarService,
    private readonly notificationGateway: NotificationGateway
  ) {
    this.queues = this.queueService.getQueues();
    this.queues.forEach((queue) => {
      queue.on('completed', (job) => {
        console.log('A job has been completed');
        this.onCompleted(job, queue);
      });
    });
    this.queues.forEach((queue) => { queue.process((job) => this.process(job)); });
    this.logger.log('QueueProcessor initialized with queues:', this.queues.map((q) => q.name));
  }

  async process(job: any) {
      this.logger.log('Processing job:', job.data);
      return { result: 'success' };
  }
  onCompleted(job: any, queue: Queue) {
      this.logger.log('Job completed ', job.id, 'from queue', queue.name);
      this.logger.log(this.todos);
      const todo = this.todos.find((t) => t.job_id === Number(job.id));
      this.logger.log('Todo:', todo);
      if (todo) {
        this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is completed!`);
      }
  }

  makeid(length: number): string {
    return uuidv4().slice(0, length);
  }

  async createTodo(
    accessKeyId: string,
    secretAccessKey: string,
    jobData: any,
  ): Promise<Todo> {
    const userId = await this.zanzibarService.getUserFromAccessKey(accessKeyId, secretAccessKey);
    this.logger.log('User ID:', userId);

    if (!userId) throw new Error('Invalid access keys');

    let {
      job,
      queue,
    } = await this.queueService.addJob(jobData);
    const todo: Todo = {
      id: this.makeid(10),
      job_id: Number(job.id),
      queue: queue.name,
      completed: false,
      userId,
    };
    this.logger.log('Created todo:', todo);

    const todos = this.todos;
    todos.push(todo);
    this.logger.log('Todos:', todos);
    this.todos = todos;
    if (!this.todos.find((t) => t.job_id === Number(job.id))) {
      throw new Error('Failed to create todo');
    }
    await this.zanzibarService.assignPermission(userId, 'read', todo.id);

    return todo;
  }

  async completeTodo(id: string, accessKeyId: string, secretAccessKey: string): Promise<Todo> {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      this.logger.error('Todo not found');
      throw new NotFoundException('Todo not found');
    }

    const hasPermission = await this.zanzibarService.checkPermission(
      accessKeyId,
      secretAccessKey,
      'read',
      todo.id,
    );

    if (!hasPermission) {
      this.logger.error('Unauthorized action');
      throw new Error('Unauthorized action');
    }

    todo.completed = true;

    this.logger.log(`Todo ${todo.id} marked as completed`);
    this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is completed!`);
    return todo;
  }
}
