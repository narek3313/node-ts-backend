import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import type { Response } from 'express';
import { LogoutCommand } from './logout.command';
import { JwtAuthGuard, type RequestWithUser } from '../../jwt/jwt.strategy';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { parseCookies } from 'src/libs/utils/cookie.util';
import { Public } from 'src/libs/decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard)
@Controller(routesV1.version)
export class LogoutUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(`${routesV1.auth.root}/logout`)
    async logout(@Req() req: RequestWithUser, @Res() res: Response) {
        const cookies = parseCookies(req.headers.cookie);
        const _sessionId = cookies['sessionId'];

        let sessionId: Uuid4 | null = null;
        if (_sessionId) {
            try {
                sessionId = Uuid4.from(_sessionId);
            } catch (err) {
                console.error(err);
            }
        }

        const userId = req.user ? Uuid4.from(req.user.sub) : null;

        if (userId && sessionId) {
            const command = new LogoutCommand({ sessionId });

            await this.commandBus.execute(command);
        }

        res.clearCookie('sessionId', { httpOnly: true, path: '/' });
        res.clearCookie('refreshToken', { httpOnly: true, path: '/' });

        res.json({ message: 'Logged out' });
    }
}
