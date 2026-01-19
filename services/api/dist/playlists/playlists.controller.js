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
exports.PlaylistsController = void 0;
const common_1 = require("@nestjs/common");
const require_role_1 = require("../auth/require-role");
const api_response_1 = require("../common/api-response");
const playlists_dto_1 = require("./playlists.dto");
const playlists_service_1 = require("./playlists.service");
let PlaylistsController = class PlaylistsController {
    playlists;
    constructor(playlists) {
        this.playlists = playlists;
    }
    async create(req, dto) {
        const created = await this.playlists.create(req.user.storeId, dto.name);
        return (0, api_response_1.ok)(created);
    }
    async get(req, id) {
        const playlist = await this.playlists.get(req.user.storeId, id);
        return (0, api_response_1.ok)(playlist);
    }
    async addItem(req, id, dto) {
        const created = await this.playlists.addItem(req.user.storeId, id, dto.assetId, dto.sortOrder, dto.durationSec);
        return (0, api_response_1.ok)(created);
    }
    async reorder(req, id, dto) {
        const result = await this.playlists.reorder(req.user.storeId, id, dto.items);
        return (0, api_response_1.ok)(result);
    }
    async removeItem(req, id, dto) {
        const result = await this.playlists.removeItem(req.user.storeId, id, dto.playlistItemId);
        return (0, api_response_1.ok)(result);
    }
};
exports.PlaylistsController = PlaylistsController;
__decorate([
    (0, common_1.Post)(),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, playlists_dto_1.CreatePlaylistDto]),
    __metadata("design:returntype", Promise)
], PlaylistsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlaylistsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, playlists_dto_1.AddPlaylistItemDto]),
    __metadata("design:returntype", Promise)
], PlaylistsController.prototype, "addItem", null);
__decorate([
    (0, common_1.Put)(':id/items/reorder'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, playlists_dto_1.ReorderDto]),
    __metadata("design:returntype", Promise)
], PlaylistsController.prototype, "reorder", null);
__decorate([
    (0, common_1.Delete)(':id/items'),
    (0, require_role_1.RequireRole)('OWNER', 'STAFF'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, playlists_dto_1.RemovePlaylistItemDto]),
    __metadata("design:returntype", Promise)
], PlaylistsController.prototype, "removeItem", null);
exports.PlaylistsController = PlaylistsController = __decorate([
    (0, common_1.Controller)('playlists'),
    __metadata("design:paramtypes", [playlists_service_1.PlaylistsService])
], PlaylistsController);
//# sourceMappingURL=playlists.controller.js.map