import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { ZanzibarService } from '../auth/zanzibar.service';
import { NotificationGateway } from '../notifications/notification/notification.gateway';
import { QueueService } from '../queue/queue.service';
import { Queue, Job } from 'bull';
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
      queue.on('global:completed', (jobId, returnValue, status) => {
        console.log('A job has been completed', [jobId, returnValue, status]);
        queue.getJob(jobId).then((job) => {
          this.onCompleted(job, queue);
        });
      });
      queue.on('global:progress', (jobId: any, progress: any) => {
        console.log(`Job ${jobId} is ${progress * 100}% ready!`);
        this.onProgress(jobId, progress);
      });
    });
    // this.queues.forEach((queue) => { queue.process((job) => this.process(job)); });
    this.logger.log('QueueProcessor initialized with queues:', this.queues.map((q) => q.name));
  }

  async process(job: any) {
      this.logger.log('Processing job:', job.data);
      return { result: 'success' };
  }
  onProgress(jobId: any, progress: any) {
    this.logger.log(`Job ${jobId} is ${progress * 100}% ready!`);
    this.logger.log(this.todos);
    const todo = this.todos.find((t) => t.job_id === Number(jobId));
    this.logger.log('Todo:', todo);
    if (todo) {
      this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is ${progress * 100}% ready!`);
      this.notificationGateway.sendJobResult(todo.userId, {
        todo_id: todo.id,
        job_id: jobId,
        progress: progress,
      }, 'job_progress');
    }    
  } //
  onCompleted(job: Job, queue: Queue) {
      this.logger.log('Job completed ', job.id, 'from queue', queue.name);
      this.logger.log(this.todos);
      const todo = this.todos.find((t) => t.job_id === Number(job.id) && t.queue === queue.name);
      this.logger.log('Todo:', todo);
      if (todo) {
        this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.id}" is completed!`);
        this.notificationGateway.sendJobResult(todo.userId, {
          todo_id: todo.id,
          job_id: job.id,
          result: job.returnvalue,
        });
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

    return todo
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
