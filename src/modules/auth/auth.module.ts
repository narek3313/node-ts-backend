import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthRepository } from './infrastructure/auth.repository';
import { AUTH_REPOSITORY } from './auth.di-tokens';
import { LoginUserHttpController } from './commands/login/login.http.controller';
import { LoginUserCommandHandler } from './commands/login/login.service';
import { JwtAuthGuard } from './jwt/jwt.strategy';
import { USER_REPOSITORY } from '../users/user.di-tokens';
import { UserRepository } from '../users/infrastructure/user.repository';
import { UserMapper } from '../users/user.mapper';
import { LogoutUserHttpController } from './commands/logout/logout.http.controller';
import { LogoutUserCommandHandler } from './commands/logout/logout.service';
import { RefreshSessionCommandHandler } from './commands/refresh/refresh.service';
import { RefreshTokenHttpController } from './commands/refresh/refresh.http.controller';

const httpControllers = [
    LoginUserHttpController,
    LogoutUserHttpController,
    RefreshTokenHttpController,
];
const commandHandlers: Provider[] = [
    LoginUserCommandHandler,
    LogoutUserCommandHandler,
    RefreshSessionCommandHandler,
];
const mappers: Provider[] = [UserMapper];
const repositories: Provider[] = [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: AUTH_REPOSITORY, useClass: AuthRepository },
];

@Module({
    imports: [
        CqrsModule,
        PrismaModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
            }),
        }),
    ],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...repositories, ...mappers, JwtAuthGuard],
    exports: [AUTH_REPOSITORY, JwtModule],
})
export class AuthModule {}
