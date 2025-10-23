import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt/jwt.strategy';

import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { UpdateUserHttpController } from './commands/update-user/update-user.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http.controller';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
import { UpdateEmailService } from './commands/update-user/handlers/update-email.service';
import { UpdateUsernameService } from './commands/update-user/handlers/update-username.service';
import { UpdatePasswordService } from './commands/update-user/handlers/update-password.service';
import { UpdateAvatarService } from './commands/update-user/handlers/update-avatar.service';
import { UserMapper } from './user.mapper';

import { USER_REPOSITORY } from './user.di-tokens';
import {
    GetUserByIdHandler,
    GetUserByEmailHandler,
} from './queries/find-users/find-users.query-handler';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from './infrastructure/user.repository';

const httpControllers = [
    CreateUserHttpController,
    UpdateUserHttpController,
    DeleteUserHttpController,
    FindUsersHttpController,
];

const commandHandlers: Provider[] = [
    CreateUserService,
    DeleteUserService,
    UpdateEmailService,
    UpdateUsernameService,
    UpdatePasswordService,
    UpdateAvatarService,
];

const queryHandlers: Provider[] = [GetUserByIdHandler, GetUserByEmailHandler];
const repositories: Provider[] = [{ provide: USER_REPOSITORY, useClass: UserRepository }];
const mappers: Provider[] = [UserMapper];
const guards: Provider[] = [{ provide: APP_GUARD, useClass: JwtAuthGuard }];

@Module({
    imports: [CqrsModule, PrismaModule, AuthModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...queryHandlers, ...mappers, ...repositories, ...guards],
    exports: [...queryHandlers, USER_REPOSITORY, ...mappers],
})
export class UserModule {}
