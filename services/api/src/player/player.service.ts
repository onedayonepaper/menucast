import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class PlayerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly devices: DevicesService,
  ) {}

  async manifest(deviceTokenPlain: string) {
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

  async recentCalls(deviceTokenPlain: string, limit: number) {
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
}
