import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

export interface RequestWithUser extends Request {
    user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        const req = context.switchToHttp().getRequest<RequestWithUser>();
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (isPublic && !token) return true;

        if (!token) return false;

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
            req.user = { sub: payload.sub, role: payload.role };
            return true;
        } catch (err) {
            console.error(err);
            if (isPublic) return true;
            return false;
        }
    }
}
