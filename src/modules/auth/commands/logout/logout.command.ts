import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class LogoutCommand extends Command {
    readonly sessionId: Uuid4;

    constructor(props: CommandProps<LogoutCommand>) {
        super(props);
        this.sessionId = props.sessionId;
    }
}
