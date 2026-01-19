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
exports.DeploymentsController = void 0;
const common_1 = require("@nestjs/common");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const deployments_service_1 = require("./deployments.service");
const deployments_dto_1 = require("./deployments.dto");
const ws_gateway_1 = require("../ws/ws.gateway");
let DeploymentsController = class DeploymentsController {
    deployments;
    ws;
    constructor(deployments, ws) {
        this.deployments = deployments;
        this.ws = ws;
    }
    async create(req, dto) {
        const dep = await this.deployments.create(req.user.storeId, dto);
        this.ws.emitDeployUpdate({
            storeId: req.user.storeId,
            deviceId: dto.targetType === 'DEVICE' ? dto.targetDeviceId : null,
            version: dep.version,
        });
        return (0, api_response_1.ok)(dep);
    }
    async rollback(req, dto) {
        const toVersion = Number(dto.toVersion);
        const dep = await this.deployments.rollback(req.user.storeId, toVersion);
        this.ws.emitDeployUpdate({
            storeId: req.user.storeId,
            version: dep.version,
        });
        return (0, api_response_1.ok)(dep);
    }
    async current(req) {
        const current = await this.deployments.getCurrent(req.user.storeId);
        return (0, api_response_1.ok)(current);
    }
};
exports.DeploymentsController = DeploymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deployments_dto_1.CreateDeploymentDto]),
    __metadata("design:returntype", Promise)
], DeploymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('rollback'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, deployments_dto_1.RollbackDto]),
    __metadata("design:returntype", Promise)
], DeploymentsController.prototype, "rollback", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeploymentsController.prototype, "current", null);
exports.DeploymentsController = DeploymentsController = __decorate([
    (0, common_1.Controller)('deployments'),
    __metadata("design:paramtypes", [deployments_service_1.DeploymentsService,
        ws_gateway_1.WsGateway])
], DeploymentsController);
//# sourceMappingURL=deployments.controller.js.map