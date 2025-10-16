import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class DeletePostCommand extends Command {
    readonly postId: Uuid4;

    constructor(props: CommandProps<DeletePostCommand>) {
        super(props);
        this.postId = props.postId;
    }
}
