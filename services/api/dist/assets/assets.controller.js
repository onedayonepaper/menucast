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
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const assets_service_1 = require("./assets.service");
let AssetsController = class AssetsController {
    assets;
    constructor(assets) {
        this.assets = assets;
    }
    async upload(req, file) {
        const created = await this.assets.upload(req.user.storeId, file);
        return (0, api_response_1.ok)(created);
    }
    async list(req) {
        const items = await this.assets.list(req.user.storeId);
        return (0, api_response_1.ok)(items);
    }
    async remove(req, id) {
        const result = await this.assets.remove(req.user.storeId, id);
        return (0, api_response_1.ok)(result);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "remove", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('assets'),
    __metadata("design:paramtypes", [assets_service_1.AssetsService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map