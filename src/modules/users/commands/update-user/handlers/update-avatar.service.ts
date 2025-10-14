import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserAvatarCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

/**
 * @commandhandler UpdateAvatarService
 * @description
 * Handles user avatar updates. Attempts to update the avatar URL
 * through the UserRepository and returns a Result indicating success
 * or an error if the user is not found.
 */
@CommandHandler(ChangeUserAvatarCommand)
export class UpdateAvatarService
    implements
        ICommandHandler<
            ChangeUserAvatarCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

    /**
     * @method execute
     * @description Executes the ChangeUserAvatarCommand:
     * 1. Updates the user's avatar in the repository.
     * 2. Returns Result.Ok(true) if successful.
     * 3. Returns Result.Err if the user does not exist.
     * @param {ChangeUserAvatarCommand} command Contains the userId and new avatar VO.
     * @returns {Promise<Result<boolean, NotFoundException>>}
     */
    async execute(command: ChangeUserAvatarCommand): Promise<Result<boolean, NotFoundException>> {
        try {
            await this.userRepo.updateAvatar(command.userId, command.avatar);
            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException) {
                return Err(err);
            }
            throw err;
        }
    }
}
