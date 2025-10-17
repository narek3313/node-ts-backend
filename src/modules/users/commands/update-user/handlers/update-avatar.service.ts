import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserAvatarCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

/**
 * @commandhandler UpdateAvatarService
 * @description
 * Handles user avatar updates through the domain model.
 * Loads the user aggregate, applies domain logic, and persists changes.
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

    async execute(
        command: ChangeUserAvatarCommand,
    ): Promise<Result<boolean, NotFoundException | UniqueConstraintError>> {
        try {
            const user = await this.userRepo.findById(command.userId);
            if (!user) {
                return Err(new NotFoundException());
            }

            user.updateAvatar(command.avatar);

            await this.userRepo.updateAvatar(user.id, user.avatar!);

            return Ok(true);
        } catch (err) {
            if (err instanceof NotFoundException || err instanceof UniqueConstraintError) {
                return Err(err);
            }
            throw err;
        }
    }
}
