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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const devices_service_1 = require("./devices.service");
const devices_dto_1 = require("./devices.dto");
const ws_gateway_1 = require("../ws/ws.gateway");
let DevicesController = class DevicesController {
    devices;
    ws;
    constructor(devices, ws) {
        this.devices = devices;
        this.ws = ws;
    }
    async createCode(req) {
        const created = await this.devices.createRegistrationCode(req.user.storeId);
        return (0, api_response_1.ok)({ code: created.code, expiresAt: created.expiresAt.toISOString() });
    }
    async register(dto) {
        const { device, deviceToken } = await this.devices.registerDevice(dto.code, dto.name, dto.screenProfile);
        this.ws.emitDeviceStatus({
            deviceId: device.id,
            online: true,
            lastSeen: new Date().toISOString(),
        });
        return (0, api_response_1.ok)({ deviceId: device.id, deviceToken, storeId: device.storeId });
    }
    async list(req) {
        const items = await this.devices.listDevices(req.user.storeId);
        return (0, api_response_1.ok)(items.map((d) => ({
            id: d.id,
            name: d.name,
            screenProfile: d.screenProfile,
            lastSeenAt: d.lastSeenAt?.toISOString() ?? null,
            createdAt: d.createdAt.toISOString(),
        })));
    }
    async heartbeat(token, dto) {
        if (!token)
            return (0, api_response_1.ok)({ accepted: false });
        const device = await this.devices.heartbeat(token, dto);
        this.ws.emitDeviceStatus({
            deviceId: device.id,
            online: true,
            lastSeen: new Date().toISOString(),
        });
        return (0, api_response_1.ok)({ accepted: true });
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)('registration-codes'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createCode", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [devices_dto_1.RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('heartbeat'),
    __param(0, (0, common_1.Headers)('x-device-token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, devices_dto_1.HeartbeatDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "heartbeat", null);
exports.DevicesController = DevicesController = __decorate([
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService,
        ws_gateway_1.WsGateway])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map