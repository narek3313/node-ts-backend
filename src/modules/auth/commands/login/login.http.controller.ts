import { BadRequestException as Http400, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { LoginCommand } from './login.command';
import { LoginRequestDto } from './login.request.dto';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { Result, match } from 'oxide.ts';
import { LoginResponse } from './login.response.dto';
import { InvalidCredentialsError } from '../../auth.errors';
import { IpAddress } from '../../domain/value-objects/ip-address.vo';
import type { Request, Response } from 'express';
import { UserAgent } from '../../domain/value-objects/user-agent.vo';

@Controller(routesV1.version)
export class LoginUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(routesV1.auth.root)
    async login(@Body() body: LoginRequestDto, @Req() req: Request, @Res() res: Response) {
        const command = new LoginCommand({
            userAgent: UserAgent.create(req.headers['user-agent']!),
            ipAddress: IpAddress.create(req.ip!),
            email: Email.create(body.email),
            password: Password.create(body.password),
        });

        const result: Result<LoginResponse, InvalidCredentialsError> =
            await this.commandBus.execute(command);

        return match(result, {
            Ok: (result) => {
                const { accessToken, refreshToken } = result.toObject();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.json({ accessToken });
            },

            Err: (err: Error) => {
                if (err instanceof InvalidCredentialsError) {
                    throw new Http400(err.message);
                }

                throw err;
            },
        });
    }
}
