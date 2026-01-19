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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WsGateway = class WsGateway {
    server;
    handleConnection(socket) {
        const { storeId, deviceId } = socket.handshake.auth ?? {};
        if (storeId)
            socket.join(`store:${storeId}`);
        if (deviceId)
            socket.join(`device:${deviceId}`);
    }
    emitDeployUpdate(payload) {
        if (payload.deviceId) {
            this.server.to(`device:${payload.deviceId}`).emit('deploy:update', payload);
            return;
        }
        this.server.to(`store:${payload.storeId}`).emit('deploy:update', payload);
    }
    emitCallEvent(payload) {
        this.server.to(`store:${payload.storeId}`).emit('call:event', payload);
    }
    emitDeviceStatus(payload) {
        this.server.to(`device:${payload.deviceId}`).emit('device:status', payload);
    }
    onPing(socket, _body) {
        socket.emit('pong', { ts: new Date().toISOString() });
    }
};
exports.WsGateway = WsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "onPing", null);
exports.WsGateway = WsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/ws', cors: { origin: '*' } })
], WsGateway);
//# sourceMappingURL=ws.gateway.js.map