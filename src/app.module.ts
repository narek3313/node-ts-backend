import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './modules/users/user.module';
import { PostModule } from './modules/posts/post.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [CqrsModule, UserModule, PostModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
