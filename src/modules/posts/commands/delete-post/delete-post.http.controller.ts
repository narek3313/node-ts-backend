import {
    Controller,
    Param,
    NotFoundException as Http404,
    ParseUUIDPipe,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { match } from 'oxide.ts';
import { DeletePostCommand } from './delete-post.command';
import { Result } from 'oxide.ts';

/**
 * @controller DeletePostHttpController
 * @description
 * Handles post deletion requests. Uses the CQRS CommandBus
 * to execute the delete post command.
 */
@Controller(routesV1.version)
export class DeletePostHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    /**
     * @route DELETE /posts/:id
     * @description Deletes a post by ID.
     * @throws {Http404} When the post is not found.
     */
    @HttpCode(204)
    @Delete(routesV1.post.delete)
    async deletePost(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
        const command = new DeletePostCommand({ postId: Uuid4.from(id) });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) {
                    throw new Http404(err.message);
                }
                throw err;
            },
        });
    }
}
