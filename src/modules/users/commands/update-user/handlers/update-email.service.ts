import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserEmailCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

/**
 * @commandhandler UpdateEmailService
 * @description
 * Handles user email updates. Attempts to update the user's email
 * through the UserRepository and returns a Result indicating success
 * or an error if the user is not found or the email is already taken.
 */
@CommandHandler(ChangeUserEmailCommand)
export class UpdateEmailService
    implements
        ICommandHandler<
            ChangeUserEmailCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    /**
     * @method execute
     * @description Executes the ChangeUserEmailCommand:
     * 1. Updates the user's email in the repository.
     * 2. Returns Result.Ok(true) if successful.
     * 3. Returns Result.Err if the user does not exist or email is already taken.
     * @param {ChangeUserEmailCommand} command Contains the userId and new email VO.
     * @returns {Promise<Result<boolean, NotFoundException | UniqueConstraintError>>}
     */
    async execute(
        command: ChangeUserEmailCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            await this.userRepo.updateEmail(command.userId, command.email);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
