import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { Inject } from '@nestjs/common';
import { AUTH_REPOSITORY } from '../../auth.di-tokens';
import { AuthRepository } from '../../infrastructure/auth.repository';

@CommandHandler(LogoutCommand)
export class LogoutUserCommandHandler implements ICommandHandler<LogoutCommand> {
    constructor(@Inject(AUTH_REPOSITORY) private readonly authrepo: AuthRepository) {}

    async execute(command: LogoutCommand): Promise<void> {
        try {
            await this.authrepo.revokeSession(command.sessionId);
        } catch (err) {
            //future logging
            console.error(err);
        }
    }
}
