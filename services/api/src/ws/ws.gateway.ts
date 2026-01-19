import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/ws', cors: { origin: '*'} })
export class WsGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(socket: Socket) {
    const { storeId, deviceId } = socket.handshake.auth ?? {};
    if (storeId) socket.join(`store:${storeId}`);
    if (deviceId) socket.join(`device:${deviceId}`);
  }

  emitDeployUpdate(payload: { storeId: string; deviceId?: string | null; version: number }) {
    if (payload.deviceId) {
      this.server.to(`device:${payload.deviceId}`).emit('deploy:update', payload);
      return;
    }
    this.server.to(`store:${payload.storeId}`).emit('deploy:update', payload);
  }

  emitCallEvent(payload: { storeId: string; action: 'CALL' | 'RECALL' | 'RESET'; number: number; ts: string }) {
    this.server.to(`store:${payload.storeId}`).emit('call:event', payload);
  }

  emitDeviceStatus(payload: { deviceId: string; online: boolean; lastSeen: string }) {
    this.server.to(`device:${payload.deviceId}`).emit('device:status', payload);
  }

  // placeholder to keep gateway alive
  @SubscribeMessage('ping')
  onPing(@ConnectedSocket() socket: Socket, @MessageBody() _body: any) {
    socket.emit('pong', { ts: new Date().toISOString() });
  }
}
