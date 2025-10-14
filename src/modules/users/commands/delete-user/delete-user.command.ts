import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class DeleteUserCommand extends Command {
    readonly userId: Uuid4;

    constructor(props: CommandProps<DeleteUserCommand>) {
        super(props);
        this.userId = props.userId;
    }
}
