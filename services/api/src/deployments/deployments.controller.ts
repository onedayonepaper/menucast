import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RequireRole } from '../auth/require-role';
import { ok } from '../common/api-response';
import { DeploymentsService } from './deployments.service';
import { CreateDeploymentDto, RollbackDto } from './deployments.dto';
import { WsGateway } from '../ws/ws.gateway';

@Controller('deployments')
export class DeploymentsController {
  constructor(
    private readonly deployments: DeploymentsService,
    private readonly ws: WsGateway,
  ) {}

  @Post()
  @RequireRole('OWNER', 'STAFF')
  async create(@Req() req: any, @Body() dto: CreateDeploymentDto) {
    const dep = await this.deployments.create(req.user.storeId, dto);

    this.ws.emitDeployUpdate({
      storeId: req.user.storeId,
      deviceId: dto.targetType === 'DEVICE' ? dto.targetDeviceId : null,
      version: dep.version,
    });

    return ok(dep);
  }

  @Post('rollback')
  @RequireRole('OWNER', 'STAFF')
  async rollback(@Req() req: any, @Body() dto: RollbackDto) {
    const toVersion = Number(dto.toVersion);
    const dep = await this.deployments.rollback(req.user.storeId, toVersion);

    this.ws.emitDeployUpdate({
      storeId: req.user.storeId,
      version: dep.version,
    });

    return ok(dep);
  }

  @Get('current')
  @RequireRole('OWNER', 'STAFF')
  async current(@Req() req: any) {
    const current = await this.deployments.getCurrent(req.user.storeId);
    return ok(current);
  }
}
