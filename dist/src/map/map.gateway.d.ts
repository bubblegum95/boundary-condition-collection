import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { MapService } from './map.service';
import { Server, Socket } from 'socket.io';
export declare class MapGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly mapService;
    constructor(mapService: MapService);
    private readonly logger;
    server: Server;
    afterInit(server: Server): void;
    handleConnection(server: Server): void;
    handleDisconnect(): void;
    handleEvent(data: string, client: Socket): void;
}
