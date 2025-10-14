import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { Result, Ok, Err } from 'oxide.ts';
import { UserRepository } from '../../infrastructure/user.repository';
import { DeleteUserCommand } from './delete-user.command';

/**
 * @commandhandler DeleteUserService
 * @description
 * Handles deletion of a user. Attempts to remove the user
 * from the repository and returns a Result indicating success
 * or an error if the user does not exist.
 */
@CommandHandler(DeleteUserCommand)
export class DeleteUserService
    implements ICommandHandler<DeleteUserCommand, Result<boolean, NotFoundException>>
{
    constructor(private readonly userRepo: UserRepository) {}

     /**
     * @method execute
     * @description Executes the DeleteUserCommand:
     * 1. Attempts to delete the user by ID in the repository.
     * 2. Returns Result.Ok(true) if deletion was successful.
     * 3. Returns Result.Err(NotFoundException) if the user does not exist.
     * @param {DeleteUserCommand} command Contains the userId to delete.
     * @returns {Promise<Result<boolean, NotFoundException>>}
     */
    async execute(command: DeleteUserCommand): Promise<Result<boolean, NotFoundException>> {
        const deleted = await this.userRepo.delete(command.userId);

        if (!deleted) return Err(new NotFoundException());

        return Ok(true);
    }
}
