import { Command, CommandProps } from 'src/libs/ddd/command.base';
import { Title } from '../../domain/value-objects/title.vo';
import { Content } from '../../domain/value-objects/content.vo';
import { PostMedia } from '../../domain/post-media.entity';
import { MediaCollection } from '../../domain/value-objects/media-collection.vo';
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
    readonly media: PostMedia;

    constructor(props: CommandProps<DeletePostMediaCommand>) {
        super(props);
        this.postId = props.postId;
        this.media = props.media;
    }
}

export class AddPostMediaCommand extends Command {
    readonly postId: Uuid4;
    readonly media: MediaCollection;

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

export class DeletePostTagsCommand extends Command {
    readonly postId: Uuid4;
    readonly tags: PostTags;

    constructor(props: CommandProps<DeletePostTagsCommand>) {
        super(props);
        this.postId = props.postId;
        this.tags = props.tags;
    }
}
