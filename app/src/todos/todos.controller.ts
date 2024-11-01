// src/todos/todos.controller.ts
import { Controller, Post, Body, Put, Param, Logger } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  private readonly logger = new Logger(TodosController.name);

  @Post()
  async createTodo(
    @Body('accessKeyId') accessKeyId: string,
    @Body('secretAccessKey') secretAccessKey: string,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    this.logger.log(`Creating todo with title: ${title}`);
    const todo = await this.todosService.createTodo(
      accessKeyId,
      secretAccessKey,
      {
        title,
        description,
      }
    );

    return {
      id: todo.id,
      job_id: todo.job_id,
      completed: todo.completed,
      userId: todo.userId,
    }
  }

  @Put(':id/complete')
  completeTodo(
    @Param('id') id: string,
    @Body('accessKeyId') accessKeyId: string,
    @Body('secretAccessKey') secretAccessKey: string,
  ) {
    return this.todosService.completeTodo(id, accessKeyId, secretAccessKey);
  }
}
