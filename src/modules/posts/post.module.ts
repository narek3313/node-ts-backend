import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostMapper } from './post.mapper';
import { UpdatePostHttpController } from './commands/update-post/update-post.http.controller';
import { DeletePostHttpController } from './commands/delete-post/delete-post.http.controller';
import { CreatePostHttpController } from './commands/create-post/create-post.http.controller';
import { CreatePostService } from './commands/create-post/create-post.service';
import { UpdatePostTitleService } from './commands/update-post/handlers/update-title.service';
import { UpdatePostContentService } from './commands/update-post/handlers/update-content.service';
import { AddPostMediaService } from './commands/update-post/handlers/add-media.service';
import { DeletePostMediaService } from './commands/update-post/handlers/delete-media.service';
import { AddPostTagsService } from './commands/update-post/handlers/add-tags.service';
import { PostRepository } from './infrastructure/post.repository';
import { POST_REPOSITORY } from './post.di-tokens';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt/jwt.strategy';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { DeletePostTagService } from './commands/update-post/handlers/delete-tag.service';

const httpControllers = [
    UpdatePostHttpController,
    DeletePostHttpController,
    CreatePostHttpController,
];

const commandHandlers: Provider[] = [
    CreatePostService,
    UpdatePostTitleService,
    UpdatePostContentService,
    AddPostMediaService,
    DeletePostMediaService,
    AddPostTagsService,
    DeletePostTagService,
];

const mappers: Provider[] = [PostMapper];
const repositories: Provider[] = [{ provide: POST_REPOSITORY, useClass: PostRepository }];
const guards: Provider[] = [{ provide: APP_GUARD, useClass: JwtAuthGuard }];

@Module({
    imports: [CqrsModule, PrismaModule, AuthModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...mappers, ...repositories, ...guards],
})
export class PostModule {}
