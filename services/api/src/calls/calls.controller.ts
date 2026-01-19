import { Body, Controller, Post, Req } from '@nestjs/common';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { CallsService } from './calls.service';
import { CallDto, ResetDto } from './calls.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly calls: CallsService) {}

  @Post('next')
  @RequireRole('OWNER', 'STAFF')
  async next(@Req() req: any) {
    const data = await this.calls.next(req.user.storeId);
    return ok(data);
  }

  @Post('call')
  @RequireRole('OWNER', 'STAFF')
  async call(@Req() req: any, @Body() dto: CallDto) {
    const data = await this.calls.call(req.user.storeId, dto.number);
    return ok(data);
  }

  @Post('recall')
  @RequireRole('OWNER', 'STAFF')
  async recall(@Req() req: any, @Body() dto: CallDto) {
    const data = await this.calls.recall(req.user.storeId, dto.number);
    return ok(data);
  }

  @Post('reset')
  @RequireRole('OWNER', 'STAFF')
  async reset(@Req() req: any, @Body() dto: ResetDto) {
    const data = await this.calls.reset(req.user.storeId, dto.toNumber);
    return ok(data);
  }
}
