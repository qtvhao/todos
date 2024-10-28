// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { ZanzibarService } from '../auth/zanzibar.service';
import { NotificationGateway } from '../notifications/notification/notification.gateway';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  constructor(
    private readonly zanzibarService: ZanzibarService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createTodo(
    accessKeyId: string,
    secretAccessKey: string,
    title: string,
    description: string,
  ): Promise<Todo | null> {
    const userId = await this.zanzibarService.getUserFromAccessKey(accessKeyId, secretAccessKey);

    if (!userId) throw new Error('Invalid access keys');

    const todo: Todo = {
      id: Date.now().toString(),
      title,
      description,
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

    this.notificationGateway.notifyUser(todo.userId, `Your todo "${todo.title}" is completed!`);
    return todo;
  }
}
