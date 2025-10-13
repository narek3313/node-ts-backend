import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './modules/users/user.module';

@Module({
    imports: [CqrsModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
