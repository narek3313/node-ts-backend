import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Title } from '../../domain/value-objects/title.vo';
import { Content } from '../../domain/value-objects/content.vo';
import { PostMedia } from '../../domain/post-media.entity';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { PostTags } from '../../domain/value-objects/post-tags.vo';

export class ChangePostTitleCommand extends Command {
    readonly postId: Uuid4;
    readonly title: Title;

    constructor(props: CommandProps<ChangePostTitleCommand>) {
        super(props);
        this.postId = props.postId;
        this.title = props.title;
    }
}

export class ChangePostContentCommand extends Command {
    readonly postId: Uuid4;
    readonly content: Content;

    constructor(props: CommandProps<ChangePostContentCommand>) {
        super(props);
        this.postId = props.postId;
        this.content = props.content;
    }
}

export class DeletePostMediaCommand extends Command {
    readonly postId: Uuid4;
    readonly mediaItemId: Uuid4;

    constructor(props: CommandProps<DeletePostMediaCommand>) {
        super(props);
        this.postId = props.postId;
        this.mediaItemId = props.mediaItemId;
    }
}

export class AddPostMediaCommand extends Command {
    readonly postId: Uuid4;
    readonly media: PostMedia;

    constructor(props: CommandProps<AddPostMediaCommand>) {
        super(props);
        this.postId = props.postId;
        this.media = props.media;
    }
}

export class AddPostTagsCommand extends Command {
    readonly postId: Uuid4;
    readonly tags: PostTags;

    constructor(props: CommandProps<AddPostTagsCommand>) {
        super(props);
        this.postId = props.postId;
        this.tags = props.tags;
    }
}

export class PublishPostCommand extends Command {
    readonly postId: Uuid4;

    constructor(props: CommandProps<PublishPostCommand>) {
        super(props);
        this.postId = props.postId;
    }
}

export class ArchivePostCommand extends Command {
    readonly postId: Uuid4;

    constructor(props: CommandProps<ArchivePostCommand>) {
        super(props);
        this.postId = props.postId;
    }
}

export class DeletePostTagCommand extends Command {
    readonly postId: Uuid4;
    readonly tag: string;

    constructor(props: CommandProps<DeletePostTagCommand>) {
        super(props);
        this.postId = props.postId;
        this.tag = props.tag;
    }
}
