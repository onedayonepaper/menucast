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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const devices_service_1 = require("../devices/devices.service");
let PlayerService = class PlayerService {
    prisma;
    devices;
    constructor(prisma, devices) {
        this.prisma = prisma;
        this.devices = devices;
    }
    async manifest(deviceTokenPlain) {
        const device = await this.devices.findByTokenOrThrow(deviceTokenPlain);
        const store = await this.prisma.store.findUnique({ where: { id: device.storeId } });
        const current = await this.prisma.storeCurrentDeployment.findUnique({
            where: { storeId: device.storeId },
            include: {
                deployment: {
                    include: {
                        playlist: {
                            include: {
                                items: { include: { asset: true }, orderBy: { sortOrder: 'asc' } },
                            },
                        },
                    },
                },
            },
        });
        const version = current?.version ?? 0;
        const layoutPreset = current?.deployment.layoutPreset ?? store?.layoutPreset ?? 'SPLIT2';
        const playlistItems = current?.deployment.playlist.items ?? [];
        return {
            storeId: device.storeId,
            deviceId: device.id,
            version,
            layoutPreset,
            callEnabled: store?.callEnabled ?? false,
            callListSize: store?.callListSize ?? 6,
            playlist: {
                id: current?.deployment.playlist.id ?? null,
                name: current?.deployment.playlist.name ?? null,
                items: playlistItems.map((it) => ({
                    playlistItemId: it.id,
                    sortOrder: it.sortOrder,
                    durationSec: it.durationSec,
                    asset: {
                        id: it.asset.id,
                        type: it.asset.type,
                        url: it.asset.url,
                        filename: it.asset.filename,
                        size: it.asset.size,
                        durationSec: it.asset.durationSec,
                    },
                })),
            },
        };
    }
    async recentCalls(deviceTokenPlain, limit) {
        const device = await this.devices.findByTokenOrThrow(deviceTokenPlain);
        const items = await this.prisma.callEvent.findMany({
            where: { storeId: device.storeId },
            orderBy: { ts: 'desc' },
            take: limit,
        });
        return items.map((e) => ({
            id: e.id,
            action: e.action,
            number: e.number,
            ts: e.ts.toISOString(),
        }));
    }
};
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        devices_service_1.DevicesService])
], PlayerService);
//# sourceMappingURL=player.service.js.map