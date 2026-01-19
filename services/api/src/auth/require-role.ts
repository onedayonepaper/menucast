import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { Role } from './roles';

export function RequireRole(...roles: Role[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, new RolesGuard(roles)));
}
