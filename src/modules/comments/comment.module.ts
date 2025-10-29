import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentMapper } from './comment.mapper';
import { CommentRepository } from './infrastructure/comment.repository';
import { JwtAuthGuard } from '../auth/jwt/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'src/db/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { COMMENT_REPOSITORY } from './comments.di-tokens';
import { CreateCommentHttpController } from './commands/create-comment/create-comment.http.controller';
import {
    CreateCommentService,
    CreateReplyService,
} from './commands/create-comment/create-comment.service';
import { DeleteCommentHttpController } from './commands/delete-comment/delete-comment.http.controller';
import { DeleteCommentService } from './commands/delete-comment/delete-comment.service';

const httpControllers = [CreateCommentHttpController, DeleteCommentHttpController];
const commandHandlers: Provider[] = [
    CreateCommentService,
    CreateReplyService,
    DeleteCommentService,
];
const mappers: Provider[] = [CommentMapper];
const repositories: Provider[] = [{ provide: COMMENT_REPOSITORY, useClass: CommentRepository }];
const guards: Provider[] = [{ provide: APP_GUARD, useClass: JwtAuthGuard }];

@Module({
    imports: [CqrsModule, PrismaModule, AuthModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...mappers, ...repositories, ...guards],
})
export class CommentModule {}
