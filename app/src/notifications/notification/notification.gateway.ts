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
  private userSockets = new Map<string, Socket[]>();

  constructor(private readonly zanzibarService: ZanzibarService) {}

  async handleConnection(client: Socket) {
    const { accessKeyId, secretAccessKey } = client.handshake.query;

    const userId = await this.zanzibarService.getUserFromAccessKey(
      accessKeyId as string,
      secretAccessKey as string,
    );

    if (userId) {
      let sockets: Socket[];
      if (this.userSockets.has(userId)) {
        sockets = this.userSockets.get(userId);
        sockets.push(client);
      }else{
        sockets = [client];
      }
      this.userSockets.set(userId, sockets);
      this.notifyUser(userId, 'You are now connected.');
    } else {
      client.disconnect(true);
    }
  }

  sendJobResult(userId: string, message: any) {
    console.log('Checking sockets for user:', userId);
    if (this.userSockets.has(userId)) {
      console.log('Sending job result to user:', userId);
      const clients = this.userSockets.get(userId);
      console.log('Sending job result to user:', userId, JSON.stringify(Object.keys(message), null, 2), "Number of clients: ", clients.length);
      clients.forEach((client) => {
        client.emit('job_result', message);
      });
    }
  }

  notifyUser(userId: string, message: string) {
    if (this.userSockets.has(userId)) {
      const clients = this.userSockets.get(userId);
      console.log('Notifying user:', userId, message);
      clients.forEach((client) => {
        client.emit('notification', message);
      });
    }
  }
}
