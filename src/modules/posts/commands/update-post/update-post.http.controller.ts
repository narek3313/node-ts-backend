import {
    Body,
    Controller,
    Patch,
    Param,
    ParseUUIDPipe,
    NotFoundException as Http404,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/configs/app.routes';
import {
    AddPostMediaCommand,
    AddPostTagsCommand,
    ChangePostContentCommand,
    ChangePostTitleCommand,
    DeletePostMediaCommand,
    DeletePostTagsCommand,
} from './update-post.command';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { PostTags } from '../../domain/value-objects/post-tags.vo';
import { Result, match } from 'oxide.ts';
import { MediaCollection } from '../../domain/value-objects/media-collection.vo';
import { PostMedia } from '../../domain/post-media.entity';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { UpdateTagsDto } from './dtos/update-tags.request.dto';
import { UpdateMediaDto } from './dtos/update-media.request.dto';
import { UpdateTitleRequestDto } from './dtos/update-title.request.dto';
import { Title } from '../../domain/value-objects/title.vo';
import { UpdateContentDto } from './dtos/update-content.request.dto';
import { Content } from '../../domain/value-objects/content.vo';

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

        match(result, {
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

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/tags/add`)
    async addTags(
        @Body() body: UpdateTagsDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const postTags = PostTags.create(body.tags);
        const command = new AddPostTagsCommand({ postId, tags: postTags });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/tags/remove`)
    async removeTags(
        @Body() body: UpdateTagsDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);
        const postTags = PostTags.create(body.tags);
        const command = new DeletePostTagsCommand({ postId, tags: postTags });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/media/add`)
    async addMedia(
        @Body() body: UpdateMediaDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);

        const primitives = (body.items ?? []).map((m) => ({
            id: Uuid4.create().value,
            url: m.url,
            type: m.type,
            size: m.size,
            duration: m.duration ?? undefined,
        }));

        const mediaCollection: MediaCollection = MediaCollection.createFromArray(primitives);

        const command = new AddPostMediaCommand({ postId, media: mediaCollection });

        const result: Result<boolean, NotFoundException> = await this.commandBus.execute(command);

        match(result, {
            Ok: () => {},
            Err: (err: Error) => {
                if (err instanceof NotFoundException) throw new Http404(err);
                throw err;
            },
        });
    }

    @Patch(`${routesV1.post.root}/:id/media/remove`)
    async removeMedia(
        @Body() body: UpdateMediaDto,
        @Param('id', new ParseUUIDPipe({ version: '4' })) _id: string,
    ): Promise<void> {
        const postId = Uuid4.from(_id);

        for (const m of body.items ?? []) {
            const primitive = {
                id: Uuid4.create().value,
                url: m.url,
                type: m.type,
                size: m.size,
                duration: m.duration ?? null,
            };

            const postMedia: PostMedia = PostMedia.fromPrimitive(primitive);
            const command = new DeletePostMediaCommand({ postId, media: postMedia });

            const result: Result<boolean, NotFoundException> =
                await this.commandBus.execute(command);

            match(result, {
                Ok: () => {},
                Err: (err: Error) => {
                    if (err instanceof NotFoundException) throw new Http404(err);
                    throw err;
                },
            });
        }
    }
}
