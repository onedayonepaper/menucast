import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class CallsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ws: WsGateway,
  ) {}

  private emit(storeId: string, action: 'CALL' | 'RECALL' | 'RESET', number: number) {
    this.ws.emitCallEvent({
      storeId,
      action,
      number,
      ts: new Date().toISOString(),
    });
  }

  async recent(storeId: string, limit: number) {
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

  async next(storeId: string) {
    // Atomic increment in sqlite via BEGIN IMMEDIATE
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe('BEGIN IMMEDIATE');
      const store = await tx.store.findUnique({ where: { id: storeId } });
      if (!store) throw new NotFoundException('Store not found');

      const number = store.callNextNo;
      await tx.store.update({
        where: { id: storeId },
        data: { callNextNo: number + 1 },
      });

      const event = await tx.callEvent.create({
        data: { id: uuidv4(), storeId, action: 'CALL', number },
      });

      await tx.$executeRawUnsafe('COMMIT');
      return { number, event };
    });

    this.emit(storeId, 'CALL', result.number);
    return { number: result.number };
  }

  async call(storeId: string, number: number) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    await this.prisma.callEvent.create({
      data: { id: uuidv4(), storeId, action: 'CALL', number },
    });

    this.emit(storeId, 'CALL', number);
    return { number };
  }

  async recall(storeId: string, number: number) {
    await this.prisma.callEvent.create({
      data: { id: uuidv4(), storeId, action: 'RECALL', number },
    });

    this.emit(storeId, 'RECALL', number);
    return { number };
  }

  async reset(storeId: string, toNumber: number) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');

    await this.prisma.store.update({
      where: { id: storeId },
      data: { callNextNo: toNumber },
    });

    await this.prisma.callEvent.create({
      data: { id: uuidv4(), storeId, action: 'RESET', number: toNumber },
    });

    this.emit(storeId, 'RESET', toNumber);
    return { toNumber };
  }
}
