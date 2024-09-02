import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    private readonly app;
    private readonly socketPort;
    constructor(app: any, socketPort: number);
    private adapterConstructor;
    private readonly logger;
    connectToRedis(host: string, port: number): Promise<void>;
    createIOServer(port: number, options?: ServerOptions): any;
}
