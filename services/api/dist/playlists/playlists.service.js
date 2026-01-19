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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
let PlaylistsService = class PlaylistsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(storeId, name) {
        return this.prisma.playlist.create({
            data: { id: (0, uuid_1.v4)(), storeId, name },
        });
    }
    async get(storeId, id) {
        const playlist = await this.prisma.playlist.findFirst({
            where: { id, storeId },
            include: { items: { include: { asset: true }, orderBy: { sortOrder: 'asc' } } },
        });
        if (!playlist)
            throw new http_exceptions_1.NotFoundException('Playlist not found');
        return playlist;
    }
    async addItem(storeId, playlistId, assetId, sortOrder, durationSec) {
        const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
        if (!playlist)
            throw new http_exceptions_1.NotFoundException('Playlist not found');
        const asset = await this.prisma.asset.findFirst({ where: { id: assetId, storeId } });
        if (!asset)
            throw new http_exceptions_1.NotFoundException('Asset not found');
        try {
            return await this.prisma.playlistItem.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    playlistId,
                    assetId,
                    sortOrder,
                    durationSec: durationSec ?? null,
                },
            });
        }
        catch {
            throw new http_exceptions_1.ConflictException('Duplicate sortOrder');
        }
    }
    async reorder(storeId, playlistId, items) {
        const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
        if (!playlist)
            throw new http_exceptions_1.NotFoundException('Playlist not found');
        await this.prisma.$transaction(async (tx) => {
            for (const it of items) {
                await tx.playlistItem.update({
                    where: { id: it.playlistItemId },
                    data: { sortOrder: it.sortOrder },
                });
            }
        });
        return { updated: true };
    }
    async removeItem(storeId, playlistId, playlistItemId) {
        const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
        if (!playlist)
            throw new http_exceptions_1.NotFoundException('Playlist not found');
        const item = await this.prisma.playlistItem.findFirst({
            where: { id: playlistItemId, playlistId },
        });
        if (!item)
            throw new http_exceptions_1.NotFoundException('Playlist item not found');
        await this.prisma.playlistItem.delete({ where: { id: playlistItemId } });
        const rest = await this.prisma.playlistItem.findMany({
            where: { playlistId },
            orderBy: { sortOrder: 'asc' },
        });
        await this.prisma.$transaction(rest.map((it, idx) => this.prisma.playlistItem.update({ where: { id: it.id }, data: { sortOrder: idx + 1 } })));
        return { deleted: true };
    }
};
exports.PlaylistsService = PlaylistsService;
exports.PlaylistsService = PlaylistsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlaylistsService);
//# sourceMappingURL=playlists.service.js.map