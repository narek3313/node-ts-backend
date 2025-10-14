import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserAvatarCommand } from '../update-user.command';
import { UserRepository } from 'src/modules/users/infrastructure/user.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UniqueConstraintError } from 'src/modules/users/user.errors';

@CommandHandler(ChangeUserAvatarCommand)
export class UpdateAvatarService
    implements
        ICommandHandler<
            ChangeUserAvatarCommand,
            Result<boolean, NotFoundException | UniqueConstraintError>
        >
{
    constructor(private readonly userRepo: UserRepository) {}

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
