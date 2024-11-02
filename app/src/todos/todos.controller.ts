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
    @Body('jobData') jobData: object,
  ) {
    this.logger.log(`Creating todo with title: ${jobData}`);
    const todo = await this.todosService.createTodo(
      accessKeyId,
      secretAccessKey,
      jobData,
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
