"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const common_1 = require("@nestjs/common");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    constructor(app, socketPort) {
        super(app);
        this.app = app;
        this.socketPort = socketPort;
        this.logger = new common_1.Logger(RedisIoAdapter.name);
    }
    async connectToRedis(host, port) {
        const publisher = (0, redis_1.createClient)({ url: `redis://${host}:${port}` });
        const subscriber = publisher.duplicate();
        await Promise.all([publisher.connect(), subscriber.connect()]);
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(publisher, subscriber);
        this.logger.log('connect to Redis');
    }
    createIOServer(port, options) {
        options = {
            ...options,
            cors: {
                origin: `http://127.0.0.1:3000`,
                methods: ['GET', 'POST'],
                credentials: true,
            },
        };
        const server = super.createIOServer(this.socketPort, options);
        server.adapter(this.adapterConstructor);
        this.logger.log(`create io server on port ${this.socketPort}`);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io-adapter.js.map