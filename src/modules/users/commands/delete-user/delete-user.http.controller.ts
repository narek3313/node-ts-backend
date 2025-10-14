import {
    Controller,
    Param,
    NotFoundException as Http404,
    ParseUUIDPipe,
    Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { match } from 'oxide.ts';
import { DeleteUserCommand } from './delete-user.command';
import { Result } from 'oxide.ts';

@Controller(routesV1.version)
export class DeleteUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Delete(routesV1.user.delete)
    async deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
        const command = new DeleteUserCommand({ userId: Uuid4.from(id) });

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
