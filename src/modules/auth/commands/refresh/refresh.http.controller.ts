import { Controller, Req, Res, Post, UnauthorizedException as Http401 } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import type { Response } from 'express';
import { RefreshCommand } from './refresh.command';
import { type RequestWithUser } from '../../jwt/jwt.strategy';
import { parseCookies } from 'src/libs/utils/cookie.util';
import { RefreshResponse } from './refresh.response.dto';
import { UnauthorizedError } from '../../auth.errors';
import { Result, match } from 'oxide.ts';
import { isProd } from 'src/libs/env/env.util';

@Controller(routesV1.version)
export class RefreshTokenHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(`${routesV1.auth.root}/refresh`)
    async refresh(@Req() req: RequestWithUser, @Res() res: Response) {
        const cookies = parseCookies(req.headers.cookie);
        if (!cookies) {
            throw new Http401('Unauthorized');
        }

        const sessionId = cookies['sessionId'];
        const refreshToken = cookies['refreshToken'];

        if (!sessionId || !refreshToken) {
            throw new Http401('Unauthorized');
        }

        const command = new RefreshCommand({ refreshToken, sessionId });

        const result: Result<RefreshResponse, UnauthorizedError> =
            await this.commandBus.execute(command);

        return match(result, {
            Ok: (response) => {
                const { accessToken, refreshToken } = response.toObject();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: isProd,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.json({ accessToken });
            },
            Err: (err: Error) => {
                if (err instanceof UnauthorizedError) {
                    throw new Http401('Unauthorized');
                }
                throw err;
            },
        });
    }
}
