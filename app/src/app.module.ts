import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QueueModule } from './queue/queue.module';
import { MessagesModule } from './messages/messages.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [TodosModule, AuthModule, NotificationsModule, QueueModule, MessagesModule, StaticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
