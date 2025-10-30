import {
    Controller,
    Delete,
    Param,
    ParseUUIDPipe,
    Req,
    BadRequestException as Http400,
    HttpCode,
    UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/configs/app.routes';
import { CommandBus } from '@nestjs/cqrs';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { type RequestWithUser } from 'src/modules/auth/jwt/jwt.strategy';
import { Result, match } from 'oxide.ts';
import { CommentDeleteError } from '../../comment.errors';
import { DeleteCommentCommand } from './delete-comment.command';
import { AuthorGuard } from 'src/libs/decorators/author-guard.decorator';

@UseGuards(AuthorGuard)
@Controller()
export class DeleteCommentHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @HttpCode(204)
    @Delete(routesV1.comment.delete)
    async delete(
        @Req() req: RequestWithUser,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ) {
        const commentId = Uuid4.from(_id);
        const authorId = Uuid4.from(req.user!.sub);

        const command = new DeleteCommentCommand({
            commentId,
            authorId,
        });

        const result: Result<Uuid4, CommentDeleteError> = await this.commandBus.execute(command);

        return match(result, {
            Ok: (id: Uuid4) => ({ id }),
            Err: (err: Error) => {
                if (err instanceof CommentDeleteError) {
                    throw new Http400(err.message);
                }
                throw err;
            },
        });
    }
}
