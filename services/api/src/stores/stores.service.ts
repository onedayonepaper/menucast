import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '../common/http-exceptions';

@Injectable()
export class StoresService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoreById(storeId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  async updateSettings(storeId: string, patch: any) {
    const store = await this.prisma.store.update({
      where: { id: storeId },
      data: patch,
    });
    return store;
  }
}
