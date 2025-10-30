import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Content } from 'src/modules/posts/domain/value-objects/content.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class UpdateCommentCommand extends Command {
    readonly commentId: Uuid4;
    readonly content: Content;

    constructor(props: CommandProps<UpdateCommentCommand>) {
        super(props);
        this.commentId = props.commentId;
        this.content = props.content;
    }
}
