import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification/notification.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [NotificationGateway],
  providers: [NotificationsService, NotificationGateway],
})
export class NotificationsModule {}
