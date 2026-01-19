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
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
function randomCode() {
    const part1 = Math.random().toString(36).slice(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${part1}-${part2}`;
}
function sha256Hex(input) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(input).digest('hex');
}
let DevicesService = class DevicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRegistrationCode(storeId) {
        const ttlMin = Number(process.env.DEVICE_REG_CODE_TTL_MIN ?? 10);
        const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);
        for (let i = 0; i < 5; i++) {
            const code = randomCode();
            try {
                const created = await this.prisma.deviceRegistrationCode.create({
                    data: {
                        id: (0, uuid_1.v4)(),
                        storeId,
                        code,
                        expiresAt,
                    },
                });
                return created;
            }
            catch { }
        }
        throw new http_exceptions_1.ConflictException('Failed to generate code');
    }
    async registerDevice(code, name, screenProfile) {
        const reg = await this.prisma.deviceRegistrationCode.findUnique({ where: { code } });
        if (!reg)
            throw new http_exceptions_1.NotFoundException('Registration code not found');
        if (reg.usedAt)
            throw new http_exceptions_1.ConflictException('Registration code already used');
        if (reg.expiresAt <= new Date())
            throw new http_exceptions_1.ConflictException('Registration code expired');
        const deviceTokenPlain = `${(0, uuid_1.v4)()}${(0, uuid_1.v4)()}${(0, uuid_1.v4)()}`;
        const tokenHash = sha256Hex(deviceTokenPlain);
        const device = await this.prisma.$transaction(async (tx) => {
            await tx.deviceRegistrationCode.update({
                where: { id: reg.id },
                data: { usedAt: new Date() },
            });
            return tx.device.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    storeId: reg.storeId,
                    name,
                    screenProfile,
                    tokenHash,
                    lastSeenAt: new Date(),
                },
            });
        });
        return { device, deviceToken: deviceTokenPlain };
    }
    async listDevices(storeId) {
        return this.prisma.device.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } });
    }
    async findByTokenOrThrow(deviceTokenPlain) {
        const tokenHash = sha256Hex(deviceTokenPlain);
        const device = await this.prisma.device.findFirst({ where: { tokenHash } });
        if (!device)
            throw new http_exceptions_1.UnauthorizedException('Invalid device token');
        return device;
    }
    async heartbeat(deviceTokenPlain, _payload) {
        const device = await this.findByTokenOrThrow(deviceTokenPlain);
        await this.prisma.device.update({
            where: { id: device.id },
            data: { lastSeenAt: new Date() },
        });
        return device;
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map