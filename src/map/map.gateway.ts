import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MapService } from './map.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MapGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly mapService: MapService) {}

  private readonly logger = new Logger(MapGateway.name);
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Socket server init');
  }

  handleConnection(server: Server) {
    this.logger.log('Socker server connection');
  }

  handleDisconnect() {
    this.logger.log('Socket server disconnection');
  }

  @SubscribeMessage('event')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    setInterval(() => {
      this.server.emit('events', {
        message: 'This is a response every 10 minutes',
      });
    }, 600000); // 600,000 밀리초 = 10분
  }
}
