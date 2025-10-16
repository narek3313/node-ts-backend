import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostMapper } from './post.mapper';

const httpControllers = [];

const commandHandlers: Provider[] = [];

const mappers: Provider[] = [PostMapper];

@Module({
    imports: [CqrsModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...mappers],
})
export class UserModule {}
