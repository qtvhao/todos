// src/todos/todos.controller.ts
import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  createTodo(
    @Body('accessKeyId') accessKeyId: string,
    @Body('secretAccessKey') secretAccessKey: string,
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return this.todosService.createTodo(
      accessKeyId,
      secretAccessKey,
      title,
      description,
    );
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
