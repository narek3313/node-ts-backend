import {
    Body,
    Controller,
    Patch,
    Param,
    ParseUUIDPipe,
    NotFoundException as Http404,
    HttpCode,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import {
    AddPostMediaCommand,
    AddPostTagsCommand,
    ArchivePostCommand,
    ChangePostContentCommand,
    ChangePostTitleCommand,
    DeletePostMediaCommand,
    DeletePostTagCommand,
    PublishPostCommand,
} from './update-post.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { PostTags } from '../../domain/value-objects/post-tags.vo';
import { Result, match } from 'oxide.ts';
import { PostMedia } from '../../domain/post-media.entity';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UpdateTitleRequestDto } from './dtos/update-title.request.dto';
import { Title } from '../../domain/value-objects/title.vo';
import { UpdateContentDto } from './dtos/update-content.request.dto';
import { Content } from '../../domain/value-objects/content.vo';
import { AddTagsDto, RemoveTagsDto } from './dtos/update-tags.request.dto';
import { AddMediaDto } from './dtos/update-media.request.dto';
import { MediaItem } from '../../domain/value-objects/media-item.vo';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { AuthorGuard } from 'src/libs/decorators/author-guard.decorator';

@UseGuards(AuthorGuard)
@Controller(routesV1.version)
export class UpdatePostHttpController {
    constructor(private readonly commandBus: CommandBus) {}

    @Patch(`${routesV1.post.root}/:id/title`)
    async updateTitle(
        @Body() body: UpdateTitleRequestDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const title = Title.create(body.title);
        const command = new ChangePostTitleCommand({ postId, title });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/content`)
    async updateContent(
        @Body() body: UpdateContentDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const content = Content.create(body.content);
        const command = new ChangePostContentCommand({ postId, content });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/publish`)
    async publish(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: string): Promise<void> {
        const postId = Uuid4.from(_id);
        const command = new PublishPostCommand({ postId });
        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/archive`)
    async archive(@Param('id', new ParseUUIDPipe({ version: '4' })) _id: string): Promise<void> {
        const postId = Uuid4.from(_id);
        const command = new ArchivePostCommand({ postId });
        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err.message);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/tags`)
    async addTags(
        @Body() body: AddTagsDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const postTags = PostTags.create(body.tags);
        const command = new AddPostTagsCommand({ postId, tags: postTags });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @HttpCode(204)
    @Delete(`${routesV1.post.root}/:id/tags`)
    async removeTags(
        @Body() body: RemoveTagsDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const tag = body.tag;
        const command = new DeletePostTagCommand({ postId, tag });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/media`)
    async addMedia(
        @Body() body: AddMediaDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<IdResponse> {
        const postId = Uuid4.from(_id);

        const media = PostMedia.create({ postId, items: MediaItem.createArray(body.items as any) });

        const command = new AddPostMediaCommand({ postId, media });

        const result: Result<Uuid4, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: (id: Uuid4) => {
                return new IdResponse(id);
            },
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @HttpCode(204)
    @Delete(`${routesV1.post.root}/:id/media/:mediaItemId`)
    async removeMedia(
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
        @Param('mediaItemId', new ParseUUIDPipe({ version: '4' })) _mediaItemId: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const mediaItemId = Uuid4.from(_mediaItemId);

        const command = new DeletePostMediaCommand({ postId, mediaItemId });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        return match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }
}
