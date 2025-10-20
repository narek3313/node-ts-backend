import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Request } from 'express';

interface RequestWithUser extends Request {
    user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<RequestWithUser>();
        const authHeader = req.headers['authorization'];
        if (!authHeader) return false;

        const token = authHeader.split(' ')[1];
        if (!token) return false;

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: process.env.JWT_SECRET,
            });

            req.user = { sub: payload.sub, role: payload.role };

            return true;
        } catch (err) {
            return false;
        }
    }
}
