import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException, UnauthorizedException } from '../common/http-exceptions';
import { Role } from './roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roles: Role[]) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const role = user.role as Role;
    if (!this.roles.includes(role)) throw new ForbiddenException();
    return true;
  }
}
