import {
    Controller,
    Get,
    ParseUUIDPipe,
    Query,
    Param,
    NotFoundException as Http404,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { FindPostCommentsQuery } from './find-comment.query-handler';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { FindPaginatedCommentsResponseDto } from './find-comment.response.dto';
import { PostNotFoundError } from 'src/modules/posts/post.errors';
import { Result, match } from 'oxide.ts';

@Controller()
export class FindCommentsHttpController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(routesV1.comment.root)
    async findPostComments(
        @Param('postId', new ParseUUIDPipe({ version: '4' })) _postId: string,
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        const postId = Uuid4.from(_postId);
        const query = new FindPostCommentsQuery(postId, offset, limit);

        const result: Result<FindPaginatedCommentsResponseDto, PostNotFoundError> =
            await this.queryBus.execute(query);

        return match(result, {
            Ok: (dto) => dto,
            Err: (err: Error) => {
                if (err instanceof PostNotFoundError) throw new Http404(err.message);
                throw err;
            },
        });
    }
}
