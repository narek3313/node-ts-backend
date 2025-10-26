import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Title } from '../../domain/value-objects/title.vo';
import { Content } from '../../domain/value-objects/content.vo';
import { PostTags } from '../../domain/value-objects/post-tags.vo';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { PostMedia } from '../../domain/post-media.entity';

export class CreatePostCommand extends Command {
    readonly authorId: Uuid4;
    readonly title: Title;
    readonly content: Content;
    readonly media: PostMedia;
    readonly tags: PostTags;

    constructor(props: CommandProps<CreatePostCommand>) {
        super(props);
        this.authorId = props.authorId;
        this.title = props.title;
        this.content = props.content;
        this.media = props.media;
        this.tags = props.tags;
    }
}
