import { CommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Result, Ok, Err } from 'oxide.ts';

export class DeleteUserCommand {
    readonly userId: Uuid4;

    constructor(props: DeleteUserCommand) {
        this.userId = props.userId;
    }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
    constructor() {}

    async execute(command: DeleteUserCommand): Promise<Result<boolean, NotFoundException>> {
        // repo logic
        // return Ok or Err
    }
}
