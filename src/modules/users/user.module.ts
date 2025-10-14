import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserHttpController } from './commands/update-user/update-user.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http.controller';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { UpdateEmailService } from './commands/update-user/handlers/update-email.service';
import { UpdatePasswordService } from './commands/update-user/handlers/update-password';
import { UpdateUsernameService } from './commands/update-user/handlers/update-username';
import { DeleteUserService } from './commands/delete-user/delete-user.service';

const httpControllers = [
    CreateUserHttpController,
    UpdateUserHttpController,
    DeleteUserHttpController,
];

const commandHandlers: Provider[] = [
    CreateUserService,
    UpdateEmailService,
    UpdatePasswordService,
    UpdateUsernameService,
    DeleteUserService,
];

@Module({
    imports: [CqrsModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers],
})
export class UserModule {}
