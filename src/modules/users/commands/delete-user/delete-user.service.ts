import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Result, Ok, Err } from 'oxide.ts';
import { UserRepository } from '../../infrastructure/user.repository';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService
    implements ICommandHandler<DeleteUserCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly userRepo: UserRepository) {}

    async execute(command: DeleteUserCommand): Promise<Result<boolean, NotFoundException>> {
        const deleted = await this.userRepo.delete(command.userId);

        if (!deleted) return Err(new NotFoundException());

        return Ok(true);
    }
}
