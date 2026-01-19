import fs from 'fs/promises';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '../common/http-exceptions';
import { v4 as uuidv4 } from 'uuid';

function detectAssetType(mime: string): 'IMAGE' | 'VIDEO' {
  if (mime.startsWith('image/')) return 'IMAGE';
  if (mime.startsWith('video/')) return 'VIDEO';
  return 'IMAGE';
}

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async upload(storeId: string, file: Express.Multer.File) {
    const assetId = uuidv4();
    const ext = path.extname(file.originalname || '').slice(1) || 'bin';

    const relDir = path.join(storeId);
    const absDir = path.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads', relDir);
    await fs.mkdir(absDir, { recursive: true });

    const filename = `${assetId}.${ext}`;
    const absPath = path.join(absDir, filename);
    await fs.writeFile(absPath, file.buffer);

    const publicBase = process.env.PUBLIC_UPLOAD_BASE_URL ?? 'http://localhost:4000/uploads';
    const url = `${publicBase}/${storeId}/${filename}`;

    const created = await this.prisma.asset.create({
      data: {
        id: assetId,
        storeId,
        type: detectAssetType(file.mimetype),
        url,
        filename: file.originalname,
        size: file.size,
      },
    });

    return created;
  }

  async list(storeId: string) {
    return this.prisma.asset.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' } });
  }

  async remove(storeId: string, assetId: string) {
    const asset = await this.prisma.asset.findFirst({ where: { id: assetId, storeId } });
    if (!asset) throw new NotFoundException('Asset not found');

    const used = await this.prisma.playlistItem.findFirst({ where: { assetId } });
    if (used) throw new ConflictException('Asset is used in a playlist');

    // best-effort delete file
    try {
      const publicBase = process.env.PUBLIC_UPLOAD_BASE_URL ?? 'http://localhost:4000/uploads';
      const rel = asset.url.replace(`${publicBase}/`, '');
      const abs = path.resolve(process.env.UPLOAD_DIR ?? '../../data/uploads', rel);
      await fs.unlink(abs);
    } catch {}

    await this.prisma.asset.delete({ where: { id: assetId } });
    return { deleted: true };
  }
}
