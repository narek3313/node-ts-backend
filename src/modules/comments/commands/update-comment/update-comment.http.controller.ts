import {
    Body,
    Controller,
    Patch,
    Param,
    ParseUUIDPipe,
    BadRequestException as Http400,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentRequestDto } from './update-comment.request.dto';
import { UpdateCommentCommand } from './update-comment.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Content } from 'src/modules/posts/domain/value-objects/content.vo';
import { Result, match } from 'oxide.ts';
import { CommentUpdateError } from '../../comment.errors';
import { CommentAuthorGuard } from 'src/libs/decorators/author-guard.decorator';

@UseGuards(CommentAuthorGuard)
@Controller()
export class UpdateCommentHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Patch(`comments/:id`)
    async update(
        @Param('commentId', new ParseUUIDPipe({ version: '4' })) _commentId: string,
        @Body() body: UpdateCommentRequestDto,
    ) {
        const commentId = Uuid4.from(_commentId);
        const content = Content.create(body.content);
        const command = new UpdateCommentCommand({ commentId, content });

        const result: Result<boolean, CommentUpdateError> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof CommentUpdateError) throw new Http400(err.message);
                throw err;
            },
        });
    }
}
