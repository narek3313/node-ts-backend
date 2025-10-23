import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostMapper } from './post.mapper';
import { UpdatePostHttpController } from './commands/update-post/update-post.http.controller';
import { DeletePostHttpController } from './commands/delete-post/delete-post.http.controller';
import { CreatePostHttpController } from './commands/create-post/create-post.http.controller';
import { CreatePostService } from './commands/create-post/create-post.service';
import { UpdatePostTitleService } from './commands/update-post/handlers/update-title.service';
import { UpdatePostContentService } from './commands/update-post/handlers/update-content.service';
import { AddPostMediaService } from './commands/update-post/handlers/add-media.service';
import { DeletePostMediaService } from './commands/update-post/handlers/delete-media.service';
import { AddPostTagsService } from './commands/update-post/handlers/add-tags.service';
import { DeletePostTagsService } from './commands/update-post/handlers/delete-tags.service';
import { PostRepository } from './infrastructure/post.repository';
import { POST_REPOSITORY } from './post.di-tokens';

const httpControllers = [
    UpdatePostHttpController,
    DeletePostHttpController,
    CreatePostHttpController,
];

const commandHandlers: Provider[] = [
    CreatePostService,
    UpdatePostTitleService,
    UpdatePostContentService,
    AddPostMediaService,
    DeletePostMediaService,
    AddPostTagsService,
    DeletePostTagsService,
];

const mappers: Provider[] = [PostMapper];
const repositories: Provider[] = [{ provide: POST_REPOSITORY, useClass: PostRepository }];

@Module({
    imports: [CqrsModule],
    controllers: [...httpControllers],
    providers: [...commandHandlers, ...mappers, ...repositories],
})
export class PostModule {}
