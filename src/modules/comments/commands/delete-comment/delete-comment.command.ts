import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class DeleteCommentCommand extends Command {
    readonly commentId: Uuid4;
    readonly authorId: Uuid4;

    constructor(props: CommandProps<DeleteCommentCommand>) {
        super(props);
        this.commentId = props.commentId;
        this.authorId = props.authorId;
    }
}
