import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto, HeartbeatDto } from './devices.dto';
import { WsGateway } from '../ws/ws.gateway';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devices: DevicesService,
    private readonly ws: WsGateway,
  ) {}

  @Post('registration-codes')
  @RequireRole('OWNER', 'STAFF')
  async createCode(@Req() req: any) {
    const created = await this.devices.createRegistrationCode(req.user.storeId);
    return ok({ code: created.code, expiresAt: created.expiresAt.toISOString() });
  }

  @Post('register')
  async register(@Body() dto: RegisterDeviceDto) {
    const { device, deviceToken } = await this.devices.registerDevice(
      dto.code,
      dto.name,
      dto.screenProfile,
    );
    this.ws.emitDeviceStatus({
      deviceId: device.id,
      online: true,
      lastSeen: new Date().toISOString(),
    });

    return ok({ deviceId: device.id, deviceToken, storeId: device.storeId });
  }

  @Get()
  @RequireRole('OWNER', 'STAFF')
  async list(@Req() req: any) {
    const items = await this.devices.listDevices(req.user.storeId);
    return ok(items.map((d) => ({
      id: d.id,
      name: d.name,
      screenProfile: d.screenProfile,
      lastSeenAt: d.lastSeenAt?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })));
  }

  @Post('heartbeat')
  async heartbeat(@Headers('x-device-token') token: string | undefined, @Body() dto: HeartbeatDto) {
    if (!token) return ok({ accepted: false });
    const device = await this.devices.heartbeat(token, dto);
    this.ws.emitDeviceStatus({
      deviceId: device.id,
      online: true,
      lastSeen: new Date().toISOString(),
    });
    return ok({ accepted: true });
  }
}
