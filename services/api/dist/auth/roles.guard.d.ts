import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Role } from './roles';
export declare class RolesGuard implements CanActivate {
    private readonly roles;
    constructor(roles: Role[]);
    canActivate(context: ExecutionContext): boolean;
}
