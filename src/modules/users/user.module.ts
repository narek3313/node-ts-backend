import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserHttpController } from './commands/update-user/update-user.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http.controller';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
import { CreateUserService } from './commands/create-user/create-user.service';
import { UpdateEmailService } from './commands/update-user/handlers/update-email.service';
import { UpdateUsernameService } from './commands/update-user/handlers/update-username.service';
import { UpdatePasswordService } from './commands/update-user/handlers/update-password.service';
import { UserMapper } from './user.mapper';
import { UserRepository } from './infrastructure/user.repository';
import { USER_REPOSITORY } from './user.di-tokens';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { UpdateAvatarService } from './commands/update-user/handlers/update-avatar.service';
import {
    GetUserByEmailHandler,
    GetUserByIdHandler,
} from './queries/find-users/find-users.query-handler';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';

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

@Module({
    imports: [CqrsModule, PrismaModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...queryHandlers, ...mappers, ...repositories],
    exports: [...queryHandlers, USER_REPOSITORY],
})
export class UserModule {}
