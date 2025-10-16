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

const httpControllers = [
    CreateUserHttpController,
    UpdateUserHttpController,
    DeleteUserHttpController,
];

const commandHandlers: Provider[] = [
    CreateUserService,
    DeleteUserService,
    UpdateEmailService,
    UpdateUsernameService,
    UpdatePasswordService,
];

const mappers: Provider[] = [UserMapper];

@Module({
    imports: [CqrsModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...mappers],
})
export class UserModule {}
