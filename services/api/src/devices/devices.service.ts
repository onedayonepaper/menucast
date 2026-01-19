import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException, UnauthorizedException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';

function randomCode() {
  const part1 = Math.random().toString(36).slice(2, 6).toUpperCase();
  const part2 = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${part1}-${part2}`;
}

function sha256Hex(input: string): string {
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(input).digest('hex');
}

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRegistrationCode(storeId: string) {
    const ttlMin = Number(process.env.DEVICE_REG_CODE_TTL_MIN ?? 10);
    const expiresAt = new Date(Date.now() + ttlMin * 60 * 1000);

    // try a few times to avoid unique collision
    for (let i = 0; i < 5; i++) {
      const code = randomCode();
      try {
        const created = await this.prisma.deviceRegistrationCode.create({
          data: {
            id: uuidv4(),
            storeId,
            code,
            expiresAt,
          },
        });
        return created;
      } catch {}
    }

    throw new ConflictException('Failed to generate code');
  }

  async registerDevice(code: string, name: string, screenProfile: string) {
    const reg = await this.prisma.deviceRegistrationCode.findUnique({ where: { code } });
    if (!reg) throw new NotFoundException('Registration code not found');
    if (reg.usedAt) throw new ConflictException('Registration code already used');
    if (reg.expiresAt <= new Date()) throw new ConflictException('Registration code expired');

    const deviceTokenPlain = `${uuidv4()}${uuidv4()}${uuidv4()}`;
    const tokenHash = sha256Hex(deviceTokenPlain);

    const device = await this.prisma.$transaction(async (tx) => {
      await tx.deviceRegistrationCode.update({
        where: { id: reg.id },
        data: { usedAt: new Date() },
      });

      return tx.device.create({
        data: {
          id: uuidv4(),
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

  async listDevices(storeId: string) {
    return this.prisma.device.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } });
  }

  async findByTokenOrThrow(deviceTokenPlain: string) {
    const tokenHash = sha256Hex(deviceTokenPlain);
    const device = await this.prisma.device.findFirst({ where: { tokenHash } });
    if (!device) throw new UnauthorizedException('Invalid device token');
    return device;
  }

  async heartbeat(deviceTokenPlain: string, _payload: any) {
    const device = await this.findByTokenOrThrow(deviceTokenPlain);
    await this.prisma.device.update({
      where: { id: device.id },
      data: { lastSeenAt: new Date() },
    });
    return device;
  }
}
