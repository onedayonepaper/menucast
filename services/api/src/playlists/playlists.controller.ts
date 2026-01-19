import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { AddPlaylistItemDto, CreatePlaylistDto, RemovePlaylistItemDto, ReorderDto } from './playlists.dto';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlists: PlaylistsService) {}

  @Post()
  @RequireRole('OWNER', 'STAFF')
  async create(@Req() req: any, @Body() dto: CreatePlaylistDto) {
    const created = await this.playlists.create(req.user.storeId, dto.name);
    return ok(created);
  }

  @Get(':id')
  @RequireRole('OWNER', 'STAFF')
  async get(@Req() req: any, @Param('id') id: string) {
    const playlist = await this.playlists.get(req.user.storeId, id);
    return ok(playlist);
  }

  @Post(':id/items')
  @RequireRole('OWNER', 'STAFF')
  async addItem(@Req() req: any, @Param('id') id: string, @Body() dto: AddPlaylistItemDto) {
    const created = await this.playlists.addItem(
      req.user.storeId,
      id,
      dto.assetId,
      dto.sortOrder,
      dto.durationSec,
    );
    return ok(created);
  }

  @Put(':id/items/reorder')
  @RequireRole('OWNER', 'STAFF')
  async reorder(@Req() req: any, @Param('id') id: string, @Body() dto: ReorderDto) {
    const result = await this.playlists.reorder(req.user.storeId, id, dto.items);
    return ok(result);
  }

  @Delete(':id/items')
  @RequireRole('OWNER', 'STAFF')
  async removeItem(@Req() req: any, @Param('id') id: string, @Body() dto: RemovePlaylistItemDto) {
    const result = await this.playlists.removeItem(req.user.storeId, id, dto.playlistItemId);
    return ok(result);
  }
}
