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
exports.DeploymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
let DeploymentsService = class DeploymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCurrent(storeId) {
        const current = await this.prisma.storeCurrentDeployment.findUnique({
            where: { storeId },
            include: { deployment: { include: { playlist: true } } },
        });
        return current;
    }
    async create(storeId, dto) {
        const playlist = await this.prisma.playlist.findFirst({ where: { id: dto.playlistId, storeId } });
        if (!playlist)
            throw new http_exceptions_1.NotFoundException('Playlist not found');
        if (dto.targetType === 'DEVICE') {
            if (!dto.targetDeviceId)
                throw new http_exceptions_1.ConflictException('targetDeviceId required');
            const device = await this.prisma.device.findFirst({ where: { id: dto.targetDeviceId, storeId } });
            if (!device)
                throw new http_exceptions_1.NotFoundException('Device not found');
        }
        const last = await this.prisma.deployment.findFirst({
            where: { storeId },
            orderBy: { version: 'desc' },
        });
        const version = (last?.version ?? 0) + 1;
        const created = await this.prisma.$transaction(async (tx) => {
            const dep = await tx.deployment.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    storeId,
                    version,
                    targetType: dto.targetType,
                    targetDeviceId: dto.targetType === 'DEVICE' ? dto.targetDeviceId : null,
                    playlistId: dto.playlistId,
                    layoutPreset: dto.layoutPreset,
                },
            });
            if (dto.targetType === 'STORE_ALL') {
                await tx.storeCurrentDeployment.upsert({
                    where: { storeId },
                    create: {
                        storeId,
                        deploymentId: dep.id,
                        version: dep.version,
                    },
                    update: {
                        deploymentId: dep.id,
                        version: dep.version,
                    },
                });
            }
            return dep;
        });
        return created;
    }
    async rollback(storeId, toVersion) {
        const dep = await this.prisma.deployment.findFirst({ where: { storeId, version: toVersion } });
        if (!dep)
            throw new http_exceptions_1.NotFoundException('Deployment version not found');
        if (dep.targetType !== 'STORE_ALL')
            throw new http_exceptions_1.ConflictException('Can only rollback STORE_ALL deployments');
        await this.prisma.storeCurrentDeployment.upsert({
            where: { storeId },
            create: { storeId, deploymentId: dep.id, version: dep.version },
            update: { deploymentId: dep.id, version: dep.version },
        });
        return dep;
    }
};
exports.DeploymentsService = DeploymentsService;
exports.DeploymentsService = DeploymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeploymentsService);
//# sourceMappingURL=deployments.service.js.map