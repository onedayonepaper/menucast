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
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const stores_service_1 = require("./stores.service");
const stores_dto_1 = require("./stores.dto");
let StoresController = class StoresController {
    stores;
    constructor(stores) {
        this.stores = stores;
    }
    async me(req) {
        const store = await this.stores.getStoreById(req.user.storeId);
        return (0, api_response_1.ok)({
            id: store.id,
            name: store.name,
            callEnabled: store.callEnabled,
            callListSize: store.callListSize,
            callStartNo: store.callStartNo,
            callNextNo: store.callNextNo,
            layoutPreset: store.layoutPreset,
        });
    }
    async patch(req, dto) {
        const store = await this.stores.updateSettings(req.user.storeId, dto);
        return (0, api_response_1.ok)({
            id: store.id,
            callEnabled: store.callEnabled,
            callListSize: store.callListSize,
            callStartNo: store.callStartNo,
            callNextNo: store.callNextNo,
            layoutPreset: store.layoutPreset,
        });
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Get)('me'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me/settings'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, stores_dto_1.PatchSettingsDto]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "patch", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
//# sourceMappingURL=stores.controller.js.map