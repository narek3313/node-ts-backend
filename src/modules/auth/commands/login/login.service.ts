import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { LoginResponse } from './login.response.dto';
import { InvalidCredentialsError } from '../../auth.errors';
import { Inject } from '@nestjs/common';
import { AUTH_REPOSITORY } from '../../auth.di-tokens';
import { Session } from 'src/modules/auth/session.entity';
import { Result, Err, Ok } from 'oxide.ts';
import { USER_REPOSITORY } from 'src/modules/users/user.di-tokens';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { verifyPassword } from 'src/libs/utils/hash';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../jwt/jwt-payload.interface';
import { RefreshToken } from '../../refresh-token.entity';
import { JwtToken } from '../../domain/value-objects/token.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { AccessToken } from '../../domain/value-objects/access-token.vo';

@CommandHandler(LoginCommand)
export class LoginUserCommandHandler
    implements ICommandHandler<LoginCommand, Result<LoginResponse, InvalidCredentialsError>>
{
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepo: AuthRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtService,
    ) {}
    async execute(command: LoginCommand): Promise<Result<LoginResponse, InvalidCredentialsError>> {
        const user = await this.userRepo.findAuthByEmail(command.email);

        if (!user) {
            return Err(new InvalidCredentialsError());
        }

        if (!verifyPassword(command.password.value, user.auth.password.value)) {
            return Err(new InvalidCredentialsError());
        }

        const existingSession = await this.authRepo.findExistingSession(
            command.userAgent,
            command.ipAddress,
            user.auth.userId,
        );

        /* creating sessionId here to pass it to refreshToken aswell */
        const sessionId = existingSession ? existingSession.id : Uuid4.create();

        const payload: JwtPayload = { sub: user.auth.userId.value, role: user.role.value };

        const _accessToken = JwtToken.createFromPayload(this.jwtService, payload, '1h');

        const accessToken = AccessToken.create({ token: _accessToken });

        const _refreshToken = JwtToken.createFromPayload(this.jwtService, payload, '7d');

        const refreshToken = RefreshToken.create({ token: _refreshToken, sessionId });

        const session = Session.create({
            id: sessionId,
            userId: user.auth.userId,
            userAgent: command.userAgent,
            ipAddress: command.ipAddress,
            refreshToken,
        });

        const sessionToken =
            existingSession && !existingSession.expired
                ? existingSession.refreshToken
                : refreshToken;

        if (!existingSession || existingSession.expired) {
            await this.authRepo.createSession(session);
        }

        const response = LoginResponse.create(sessionToken, accessToken, sessionId);

        return Ok(response);
    }
}
