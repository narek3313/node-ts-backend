import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/posts/post.module';

@Module({
    imports: [CqrsModule, UserModule, AuthModule, PostModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
