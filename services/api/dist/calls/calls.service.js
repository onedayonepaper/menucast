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
exports.CallsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const http_exceptions_1 = require("../common/http-exceptions");
const uuid_1 = require("uuid");
const ws_gateway_1 = require("../ws/ws.gateway");
let CallsService = class CallsService {
    prisma;
    ws;
    constructor(prisma, ws) {
        this.prisma = prisma;
        this.ws = ws;
    }
    emit(storeId, action, number) {
        this.ws.emitCallEvent({
            storeId,
            action,
            number,
            ts: new Date().toISOString(),
        });
    }
    async recent(storeId, limit) {
        const events = await this.prisma.callEvent.findMany({
            where: { storeId },
            orderBy: { ts: 'desc' },
            take: limit,
        });
        return events.map((e) => ({
            id: e.id,
            action: e.action,
            number: e.number,
            ts: e.ts.toISOString(),
        }));
    }
    async next(storeId) {
        const result = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe('BEGIN IMMEDIATE');
            const store = await tx.store.findUnique({ where: { id: storeId } });
            if (!store)
                throw new http_exceptions_1.NotFoundException('Store not found');
            const number = store.callNextNo;
            await tx.store.update({
                where: { id: storeId },
                data: { callNextNo: number + 1 },
            });
            const event = await tx.callEvent.create({
                data: { id: (0, uuid_1.v4)(), storeId, action: 'CALL', number },
            });
            await tx.$executeRawUnsafe('COMMIT');
            return { number, event };
        });
        this.emit(storeId, 'CALL', result.number);
        return { number: result.number };
    }
    async call(storeId, number) {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store)
            throw new http_exceptions_1.NotFoundException('Store not found');
        await this.prisma.callEvent.create({
            data: { id: (0, uuid_1.v4)(), storeId, action: 'CALL', number },
        });
        this.emit(storeId, 'CALL', number);
        return { number };
    }
    async recall(storeId, number) {
        await this.prisma.callEvent.create({
            data: { id: (0, uuid_1.v4)(), storeId, action: 'RECALL', number },
        });
        this.emit(storeId, 'RECALL', number);
        return { number };
    }
    async reset(storeId, toNumber) {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store)
            throw new http_exceptions_1.NotFoundException('Store not found');
        await this.prisma.store.update({
            where: { id: storeId },
            data: { callNextNo: toNumber },
        });
        await this.prisma.callEvent.create({
            data: { id: (0, uuid_1.v4)(), storeId, action: 'RESET', number: toNumber },
        });
        this.emit(storeId, 'RESET', toNumber);
        return { toNumber };
    }
};
exports.CallsService = CallsService;
exports.CallsService = CallsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ws_gateway_1.WsGateway])
], CallsService);
//# sourceMappingURL=calls.service.js.map