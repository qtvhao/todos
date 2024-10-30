// src/notifications/notification.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ZanzibarService } from '../../auth/zanzibar.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Cho phép tất cả các nguồn gốc (có thể điều chỉnh để bảo mật hơn)
  },
})
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private userSockets = new Map<string, Socket>();

  constructor(private readonly zanzibarService: ZanzibarService) {}

  async handleConnection(client: Socket) {
    const { accessKeyId, secretAccessKey } = client.handshake.query;

    const userId = await this.zanzibarService.getUserFromAccessKey(
      accessKeyId as string,
      secretAccessKey as string,
    );

    if (userId) {
      this.userSockets.set(userId, client);
      this.notifyUser(userId, 'You are now connected.');
    } else {
      client.disconnect(true);
    }
  }

  notifyUser(userId: string, message: string) {
    const client = this.userSockets.get(userId);
    if (client) {
      client.emit('notification', message);
    }
  }
}
