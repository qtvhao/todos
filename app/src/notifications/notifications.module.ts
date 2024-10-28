import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification/notification.gateway';

@Module({
  providers: [NotificationsService, NotificationGateway]
})
export class NotificationsModule {}
