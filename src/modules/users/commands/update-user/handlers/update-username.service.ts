import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserUsernameCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

/**
 * @commandhandler UpdateUsernameService
 * @description
 * Handles user username updates. Attempts to update the username
 * through the UserRepository and returns a Result indicating success
 * or an error if the user is not found or the username is already taken.
 */
@CommandHandler(ChangeUserUsernameCommand)
export class UpdateUsernameService
    implements
        ICommandHandler<
            ChangeUserUsernameCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    /**
     * @method execute
     * @description Executes the ChangeUserUsernameCommand:
     * 1. Updates the user's username in the repository.
     * 2. Returns a Result.Ok(true) if successful.
     * 3. Returns Result.Err if the user does not exist or the username is already taken.
     * @param {ChangeUserUsernameCommand} command Contains the userId and new username VO.
     * @returns {Promise<Result<boolean, NotFoundException | UniqueConstraintError>>}
     */
    async execute(
        command: ChangeUserUsernameCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            await this.userRepo.updateUsername(command.userId, command.username);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
