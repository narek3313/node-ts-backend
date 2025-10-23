import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BadRequestException as Http400, Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { LoginCommand } from './login.command';
import { LoginRequestDto } from './login.request.dto';
import { LoginResponse } from './login.response.dto';
import { InvalidCredentialsError } from '../../auth.errors';
import { Result, match } from 'oxide.ts';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { IpAddress } from '../../domain/value-objects/ip-address.vo';
import { UserAgent } from '../../domain/value-objects/user-agent.vo';
import type { Request, Response } from 'express';
import { Public } from 'src/libs/decorators/public.decorator';
import { isProd } from 'src/libs/env/env.util';

@ApiTags('Auth')
@Public()
@Controller(routesV1.auth.root)
export class LoginUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('/login')
    @ApiOperation({
        summary: 'User login',
        description:
            'Authenticates a user and returns an access token. Sets session and refresh cookies.',
    })
    @ApiBody({
        type: LoginRequestDto,
        examples: {
            example: {
                summary: 'Sample user registration payload',
                value: {
                    email: 'jane.doe@example.com',
                    password: 'StrongPass123!',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid credentials.',
        type: Http400,
    })
    @ApiResponse({
        status: 200,
        description:
            'Login successful. Returns accessToken in the response body. Refresh token and sessionId are sent as HttpOnly cookies.',
        schema: {
            example: {
                accessToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            },
        },
    })
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
                const { accessToken, refreshToken, sessionId } = result.toObject();

                res.cookie('sessionId', sessionId, {
                    httpOnly: true,
                    secure: isProd,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

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
                if (err instanceof InvalidCredentialsError) {
                    throw new Http400(err.message);
                }

                throw err;
            },
        });
    }
}
