import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [TodosModule, AuthModule, NotificationsModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
