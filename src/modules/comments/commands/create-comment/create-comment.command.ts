import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Content } from 'src/modules/posts/domain/value-objects/content.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class CreateCommentCommand extends Command {
    readonly authorId: Uuid4;
    readonly postId: Uuid4;
    readonly content: Content;

    constructor(props: CommandProps<CreateCommentCommand>) {
        super(props);
        this.authorId = props.authorId;
        this.postId = props.postId;
        this.content = props.content;
    }
}

export class CreateReplyCommand extends Command {
    readonly parentId: Uuid4;
    readonly authorId: Uuid4;
    readonly content: Content;

    constructor(props: CommandProps<CreateReplyCommand>) {
        super(props);
        this.parentId = props.parentId;
        this.authorId = props.authorId;
        this.content = props.content;
    }
}
