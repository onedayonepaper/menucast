import { Controller, Get, Headers, Query } from '@nestjs/common';
import { ok } from '../common/api-response';
import { PlayerService } from './player.service';

@Controller()
export class PlayerController {
  constructor(private readonly player: PlayerService) {}

  @Get('player/manifest')
  async manifest(@Headers('x-device-token') token: string | undefined) {
    const data = await this.player.manifest(token ?? '');
    return ok(data);
  }

  @Get('calls/recent')
  async recent(
    @Headers('x-device-token') token: string | undefined,
    @Query('limit') limitStr: string | undefined,
  ) {
    const limit = Math.max(1, Math.min(30, Number(limitStr ?? 6)));
    const data = await this.player.recentCalls(token ?? '', limit);
    return ok(data);
  }
}
