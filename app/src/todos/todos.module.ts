import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [AuthModule, NotificationsModule, QueueModule],
  providers: [TodosService],
  exports: [TodosService],
  controllers: [TodosController]
})
export class TodosModule {}
