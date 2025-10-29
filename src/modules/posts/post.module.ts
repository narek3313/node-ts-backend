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
import { DeletePostService } from './commands/delete-post/delete-post.service';
import { PublisPostService } from './commands/update-post/handlers/publish-post.service';
import { ArchivePostService } from './commands/update-post/handlers/archive-post.service';
import { FindPostsHttpController } from './queries/find-posts/find-posts.http.controller';
import {
    GetPostByIdHandler,
    GetPostsByUserHandler,
} from './queries/find-posts/find-post.query-handler';
import { COMMENT_REPOSITORY } from '../comments/comments.di-tokens';
import { CommentRepository } from '../comments/infrastructure/comment.repository';
import { CommentModule } from '../comments/comment.module';
import { CommentMapper } from '../comments/comment.mapper';

const httpControllers = [
    UpdatePostHttpController,
    DeletePostHttpController,
    CreatePostHttpController,
    FindPostsHttpController,
];

const commandHandlers: Provider[] = [
    PublisPostService,
    ArchivePostService,
    CreatePostService,
    DeletePostService,
    UpdatePostTitleService,
    UpdatePostContentService,
    AddPostMediaService,
    DeletePostMediaService,
    AddPostTagsService,
    DeletePostTagService,
];

const querieHandlers: Provider[] = [GetPostByIdHandler, GetPostsByUserHandler];

const mappers: Provider[] = [PostMapper, CommentMapper];
const repositories: Provider[] = [
    { provide: COMMENT_REPOSITORY, useClass: CommentRepository },
    { provide: POST_REPOSITORY, useClass: PostRepository },
];
const guards: Provider[] = [{ provide: APP_GUARD, useClass: JwtAuthGuard }];

@Module({
    imports: [CqrsModule, PrismaModule, AuthModule, CommentModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...querieHandlers, ...mappers, ...repositories, ...guards],
})
export class PostModule {}
