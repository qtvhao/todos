// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { ZanzibarService } from '../auth/zanzibar.service';
import { NotificationGateway } from '../notifications/notification/notification.gateway';
import { QueueService } from '../queue/queue.service';
import { Processor, OnQueueCompleted } from '@nestjs/bull';

const BULL_QUEUE_NAME = process.env.BULL_QUEUE_NAME || 'queue';
const BULL_QUEUE_NAMES = BULL_QUEUE_NAME.split(',');
@Injectable()
@Processor(BULL_QUEUE_NAMES[0])
export class TodosService {
  private todos: Todo[] = [];

  constructor(
    private readonly queueService: QueueService,
    private readonly zanzibarService: ZanzibarService,
    private readonly notificationGateway: NotificationGateway,
  ) {}



  @OnQueueCompleted()
  async onCompleted(job: any) {
      // console.log('Job completed with result', job.returnvalue);
      const todo = this.todos.find((t) => t.job_id === Number(job.id));
      if (todo) {
        // console.log('Todo:', todo);
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
