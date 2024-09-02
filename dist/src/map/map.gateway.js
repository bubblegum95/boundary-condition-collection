"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MapGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const map_service_1 = require("./map.service");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let MapGateway = MapGateway_1 = class MapGateway {
    constructor(mapService) {
        this.mapService = mapService;
        this.logger = new common_1.Logger(MapGateway_1.name);
    }
    afterInit(server) {
        this.logger.log('Socket server init');
    }
    handleConnection(server) {
        this.logger.log('Socker server connection');
    }
    handleDisconnect() {
        this.logger.log('Socket server disconnection');
    }
    handleEvent(data, client) {
        setInterval(() => {
            this.server.emit('events', {
                message: 'This is a response every 10 minutes',
            });
        }, 600000);
    }
};
exports.MapGateway = MapGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MapGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('event'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MapGateway.prototype, "handleEvent", null);
exports.MapGateway = MapGateway = MapGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [map_service_1.MapService])
], MapGateway);
//# sourceMappingURL=map.gateway.js.map