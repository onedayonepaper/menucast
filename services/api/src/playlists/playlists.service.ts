import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlaylistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(storeId: string, name: string) {
    return this.prisma.playlist.create({
      data: { id: uuidv4(), storeId, name },
    });
  }

  async get(storeId: string, id: string) {
    const playlist = await this.prisma.playlist.findFirst({
      where: { id, storeId },
      include: { items: { include: { asset: true }, orderBy: { sortOrder: 'asc' } } },
    });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async addItem(storeId: string, playlistId: string, assetId: string, sortOrder: number, durationSec?: number) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const asset = await this.prisma.asset.findFirst({ where: { id: assetId, storeId } });
    if (!asset) throw new NotFoundException('Asset not found');

    try {
      return await this.prisma.playlistItem.create({
        data: {
          id: uuidv4(),
          playlistId,
          assetId,
          sortOrder,
          durationSec: durationSec ?? null,
        },
      });
    } catch {
      throw new ConflictException('Duplicate sortOrder');
    }
  }

  async reorder(storeId: string, playlistId: string, items: { playlistItemId: string; sortOrder: number }[]) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    // transactional update
    await this.prisma.$transaction(async (tx) => {
      for (const it of items) {
        await tx.playlistItem.update({
          where: { id: it.playlistItemId },
          data: { sortOrder: it.sortOrder },
        });
      }
    });

    return { updated: true };
  }

  async removeItem(storeId: string, playlistId: string, playlistItemId: string) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, storeId } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const item = await this.prisma.playlistItem.findFirst({
      where: { id: playlistItemId, playlistId },
    });
    if (!item) throw new NotFoundException('Playlist item not found');

    await this.prisma.playlistItem.delete({ where: { id: playlistItemId } });

    // normalize orders to 1..N to keep UI stable
    const rest = await this.prisma.playlistItem.findMany({
      where: { playlistId },
      orderBy: { sortOrder: 'asc' },
    });

    await this.prisma.$transaction(
      rest.map((it, idx) =>
        this.prisma.playlistItem.update({ where: { id: it.id }, data: { sortOrder: idx + 1 } }),
      ),
    );

    return { deleted: true };
  }
}
