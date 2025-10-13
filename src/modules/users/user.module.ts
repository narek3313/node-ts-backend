import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { CreateUserHttpController } from './use-cases/create-user/create-user.http.controller';

const httpControllers = [CreateUserHttpController];

const commandHandlers: Provider[] = [CreateUserService];

@Module({
    imports: [CqrsModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers],
})
export class UserModule {}
