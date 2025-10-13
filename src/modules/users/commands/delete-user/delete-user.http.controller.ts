import { Controller, Param, NotFoundException as Http404 } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { match } from 'oxide.ts';
import { DeleteUserCommand } from './delete-user.service';

@Controller(routesV1.version)
export class DeleteUserHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    async deleteUser(@Param('id') id: Uuid4): Promise<void> {
        const command = new DeleteUserCommand({ userId: id });
        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: (isOk: boolean) => isOk,
            Err: (err: Error) => {
                if (err instanceof NotFoundException) {
                    throw new Http404(err.message);
                }
                throw err;
            },
        });
    }
}
