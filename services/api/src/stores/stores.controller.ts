import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { StoresService } from './stores.service';
import { PatchSettingsDto } from './stores.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly stores: StoresService) {}

  @Get('me')
  @RequireRole('OWNER', 'STAFF')
  async me(@Req() req: any) {
    const store = await this.stores.getStoreById(req.user.storeId);
    return ok({
      id: store.id,
      name: store.name,
      callEnabled: store.callEnabled,
      callListSize: store.callListSize,
      callStartNo: store.callStartNo,
      callNextNo: store.callNextNo,
      layoutPreset: store.layoutPreset,
    });
  }

  @Patch('me/settings')
  @RequireRole('OWNER', 'STAFF')
  async patch(@Req() req: any, @Body() dto: PatchSettingsDto) {
    const store = await this.stores.updateSettings(req.user.storeId, dto);
    return ok({
      id: store.id,
      callEnabled: store.callEnabled,
      callListSize: store.callListSize,
      callStartNo: store.callStartNo,
      callNextNo: store.callNextNo,
      layoutPreset: store.layoutPreset,
    });
  }
}
