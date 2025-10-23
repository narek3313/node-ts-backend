import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/modules/auth/jwt/jwt.strategy';

export const ROLES_ENUM = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
} as const;

export const ROLES_KEY = 'roles';

export const Roles = (...roles: (typeof ROLES_ENUM)[keyof typeof ROLES_ENUM][]) =>
    SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<
            (typeof ROLES_ENUM)[keyof typeof ROLES_ENUM][]
        >(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest<RequestWithUser>();
        const user = req.user;

        if (!user) throw new ForbiddenException('No user found');


        if (!requiredRoles.includes(user.role))
            throw new ForbiddenException('Insufficient permissions');

        return true;
    }
}
