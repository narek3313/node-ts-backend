import {
    Body,
    Controller,
    Post,
    Req,
    Param,
    ParseUUIDPipe,
    BadRequestException as Http400,
} from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';
import { CreateCommentRequestDto, CreateReplyRequestDto } from './create-comment.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand, CreateReplyCommand } from './create-comment.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Content } from 'src/modules/posts/domain/value-objects/content.vo';
import { type RequestWithUser } from 'src/modules/auth/jwt/jwt.strategy';
import { Result, match } from 'oxide.ts';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { CommentCreateError } from '../../comment.errors';

@Controller()
export class CreateCommentHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(routesV1.comment.root)
    async create(
        @Body() body: CreateCommentRequestDto,
        @Req() req: RequestWithUser,
        @Param('postId', new ParseUUIDPipe({ version: '4' })) _postId: string,
    ) {
        const content = Content.create(body.content);
        const postId = Uuid4.from(_postId);
        const authorId = Uuid4.from(req.user!.sub);
        const command = new CreateCommentCommand({ content, postId, authorId });

        const result: Result<Uuid4, CommentCreateError> = await this.commandBus.execute(command);

        return match(result, {
            Ok: (id: Uuid4) => {
                return new IdResponse(id);
            },
            Err: (err: Error) => {
                if (err instanceof CommentCreateError) {
                    throw new Http400(err.message);
                }
                throw err;
            },
        });
    }

    @Post(routesV1.reply.root)
    async createReply(
        @Body() body: CreateReplyRequestDto,
        @Req() req: RequestWithUser,
        @Param('commentId', new ParseUUIDPipe({ version: '4' })) _commentId: string,
    ) {
        const parentId = Uuid4.from(_commentId);
        const authorId = Uuid4.from(req.user!.sub);
        const content = Content.create(body.content);

        const command = new CreateReplyCommand({
            parentId,
            authorId,
            content,
        });

        const result: Result<Uuid4, CommentCreateError> = await this.commandBus.execute(command);

        return match(result, {
            Ok: (id: Uuid4) => {
                return new IdResponse(id);
            },
            Err: (err: Error) => {
                if (err instanceof CommentCreateError) {
                    throw new Http400(err.message);
                }
                throw err;
            },
        });
    }
}
