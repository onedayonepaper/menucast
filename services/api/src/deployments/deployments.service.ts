import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeploymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(storeId: string) {
    const current = await this.prisma.storeCurrentDeployment.findUnique({
      where: { storeId },
      include: { deployment: { include: { playlist: true } } },
    });
    return current;
  }

  async create(storeId: string, dto: {
    targetType: 'STORE_ALL' | 'DEVICE';
    targetDeviceId?: string;
    playlistId: string;
    layoutPreset: 'SPLIT2' | 'SPLIT3_CALL_1450x1080' | 'FULLSCREEN';
  }) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: dto.playlistId, storeId } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (dto.targetType === 'DEVICE') {
      if (!dto.targetDeviceId) throw new ConflictException('targetDeviceId required');
      const device = await this.prisma.device.findFirst({ where: { id: dto.targetDeviceId, storeId } });
      if (!device) throw new NotFoundException('Device not found');
    }

    const last = await this.prisma.deployment.findFirst({
      where: { storeId },
      orderBy: { version: 'desc' },
    });
    const version = (last?.version ?? 0) + 1;

    const created = await this.prisma.$transaction(async (tx) => {
      const dep = await tx.deployment.create({
        data: {
          id: uuidv4(),
          storeId,
          version,
          targetType: dto.targetType,
          targetDeviceId: dto.targetType === 'DEVICE' ? dto.targetDeviceId! : null,
          playlistId: dto.playlistId,
          layoutPreset: dto.layoutPreset,
        },
      });

      // update store pointer only for STORE_ALL target
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

  async rollback(storeId: string, toVersion: number) {
    const dep = await this.prisma.deployment.findFirst({ where: { storeId, version: toVersion } });
    if (!dep) throw new NotFoundException('Deployment version not found');
    if (dep.targetType !== 'STORE_ALL') throw new ConflictException('Can only rollback STORE_ALL deployments');

    await this.prisma.storeCurrentDeployment.upsert({
      where: { storeId },
      create: { storeId, deploymentId: dep.id, version: dep.version },
      update: { deploymentId: dep.id, version: dep.version },
    });

    return dep;
  }
}
