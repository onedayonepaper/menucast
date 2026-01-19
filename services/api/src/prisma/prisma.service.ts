import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    // WAL + FK (PRAGMA returns rows in SQLite; use queryRaw)
    await this.$queryRaw`PRAGMA foreign_keys = ON;`;
    await this.$queryRaw`PRAGMA journal_mode = WAL;`;
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
