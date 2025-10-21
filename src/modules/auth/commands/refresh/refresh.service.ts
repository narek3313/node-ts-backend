import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from './refresh.command';
import { AUTH_REPOSITORY } from '../../auth.di-tokens';
import { Inject } from '@nestjs/common';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UnauthorizedError } from '../../auth.errors';
import { Result, Err, Ok } from 'oxide.ts';
import { JwtPayload } from '../../jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtToken } from '../../domain/value-objects/token.vo';
import { RefreshToken } from '../../refresh-token.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { AccessToken } from '../../domain/value-objects/access-token.vo';
import { RefreshResponse } from './refresh.response.dto';

@CommandHandler(RefreshCommand)
export class RefreshSessionCommandHandler
    implements ICommandHandler<RefreshCommand, Result<RefreshResponse, UnauthorizedError>>
{
    constructor(
        @Inject(AUTH_REPOSITORY) private readonly authRepo: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(command: RefreshCommand): Promise<any> {
        const session = await this.authRepo.findSessionById(command.sessionId);

        if (!session || (session && session.expired)) {
            return Err(new UnauthorizedError());
        }

        const { sub, role }: JwtPayload = this.jwtService.decode(command.refreshToken);

        const payload: JwtPayload = { sub, role };

        const _refreshToken = JwtToken.createFromPayload(this.jwtService, payload, '7d');

        const refreshToken = RefreshToken.create({
            token: _refreshToken,
            sessionId: Uuid4.from(command.sessionId),
        });

        await this.authRepo.rotateRefreshToken(command.sessionId, refreshToken);

        const _accessToken = JwtToken.createFromPayload(this.jwtService, payload, '1h');

        const accessToken = AccessToken.create({ token: _accessToken });

        const response = new RefreshResponse(accessToken, refreshToken);

        return Ok(response);
    }
}
