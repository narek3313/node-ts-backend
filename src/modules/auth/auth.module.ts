import { Module, Provider } from '@nestjs/common';
import { LoginUserHttpController } from './commands/login/login.http.controller';
import { LoginUserCommandHandler } from './commands/login/login.service';
import { AUTH_REPOSITORY } from './auth.di-tokens';
import { AuthRepository } from './infrastructure/auth.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const httpControllers = [LoginUserHttpController];
const commandHandlers: Provider[] = [LoginUserCommandHandler];
const queryHandlers: Provider[] = [];
const repositories: Provider[] = [{ provide: AUTH_REPOSITORY, useClass: AuthRepository }];
const mappers: Provider[] = [];

@Module({
    imports: [
        CqrsModule,
        PrismaModule,
        UserModule,
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
    providers: [...commandHandlers, ...queryHandlers, ...mappers, ...repositories],
    exports: [...repositories],
})
export class AuthModule {}
