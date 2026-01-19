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
exports.CallsController = void 0;
const common_1 = require("@nestjs/common");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const calls_service_1 = require("./calls.service");
const calls_dto_1 = require("./calls.dto");
let CallsController = class CallsController {
    calls;
    constructor(calls) {
        this.calls = calls;
    }
    async next(req) {
        const data = await this.calls.next(req.user.storeId);
        return (0, api_response_1.ok)(data);
    }
    async call(req, dto) {
        const data = await this.calls.call(req.user.storeId, dto.number);
        return (0, api_response_1.ok)(data);
    }
    async recall(req, dto) {
        const data = await this.calls.recall(req.user.storeId, dto.number);
        return (0, api_response_1.ok)(data);
    }
    async reset(req, dto) {
        const data = await this.calls.reset(req.user.storeId, dto.toNumber);
        return (0, api_response_1.ok)(data);
    }
};
exports.CallsController = CallsController;
__decorate([
    (0, common_1.Post)('next'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "next", null);
__decorate([
    (0, common_1.Post)('call'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calls_dto_1.CallDto]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "call", null);
__decorate([
    (0, common_1.Post)('recall'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calls_dto_1.CallDto]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "recall", null);
__decorate([
    (0, common_1.Post)('reset'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, calls_dto_1.ResetDto]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "reset", null);
exports.CallsController = CallsController = __decorate([
    (0, common_1.Controller)('calls'),
    __metadata("design:paramtypes", [calls_service_1.CallsService])
], CallsController);
//# sourceMappingURL=calls.controller.js.map