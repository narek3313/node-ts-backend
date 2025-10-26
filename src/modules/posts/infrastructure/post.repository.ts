import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { PostRepositoryContract } from '../domain/repository.contract';
import { Post } from '../domain/post.entity';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Title } from '../domain/value-objects/title.vo';
import { Content } from '../domain/value-objects/content.vo';
import { PostStatus } from '../domain/value-objects/post-status.vo';
import { PostMapper } from '../post.mapper';
import { PostCollection } from '../domain/collections/posts.collection';
import { PostTags } from '../domain/value-objects/post-tags.vo';
import { NotFoundException } from 'src/libs/exceptions/exceptions';
import { PostMedia } from 'src/modules/posts/domain/post-media.entity';
import { MediaItem, MediaItemPrimitives } from '../domain/value-objects/media-item.vo';

@Injectable()
export class PostRepository implements PostRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PostMapper,
    ) {}

    async create(_post: Post): Promise<IdResponse> {
        const { media, ...postData } = _post.toObject();
        const mediaItems = media.items;

        await this.prisma.post.create({
            data: {
                ...postData,
                media: {
                    create: {
                        id: Uuid4.create().value,
                        items: {
                            createMany: {
                                data: mediaItems.map((item: MediaItemPrimitives) => ({
                                    id: Uuid4.create().value,
                                    url: item.url,
                                    size: item.size,
                                    type: item.type,
                                    duration: item.duration ?? null,
                                })),
                                skipDuplicates: true,
                            },
                        },
                    },
                },
            },
        });

        return new IdResponse(_post.id);
    }

    async getMediaItems(
        postMediaId: Uuid4,
        option: 'asPrimitives' | 'asDomain' = 'asDomain',
    ): Promise<MediaItem[] | MediaItemPrimitives[] | []> {
        console.log(`postmediaid: `, postMediaId);
        const items = await this.prisma.postMediaItem.findMany({
            where: {
                postMediaId: postMediaId.value,
            },
        });

        if (!items) {
            return [];
        }

        const result: MediaItem[] = [];

        if (option === 'asDomain') {
            for (let i = 0; i < items.length; i++) {
                //@ts-expect-error enum string type error I dont know how to fix
                result.push(MediaItem.fromPrimitives(items[i]));
            }

            return result;
        }

        //@ts-expect-error enum string type error I dont know how to fix
        return items;
    }

    async updateTitle(id: Uuid4, title: Title): Promise<void> {
        await this.prisma.post.update({
            where: { id: id.value },
            data: { title: title.value },
        });
    }

    async updateContent(id: Uuid4, content: Content): Promise<void> {
        await this.prisma.post.update({
            where: { id: id.value },
            data: { content: content.value },
        });
    }

    async updateStatus(id: Uuid4, status: PostStatus): Promise<void> {
        await this.prisma.post.update({
            where: { id: id.value },
            data: { status: status.value },
        });
    }

    async addMedia(postMediaId: Uuid4, _mediaItem: MediaItem): Promise<void> {
        const items = (await this.getMediaItems(
            postMediaId,
            'asPrimitives',
        )) as MediaItemPrimitives[];

        const mediaItem = _mediaItem.toJSON();
        console.log(`item to add: `, _mediaItem);
        console.log(`items of the post: `, items);
        const updatedItems = [...items, mediaItem] as any;
        await this.prisma.postMedia.update({
            where: { id: postMediaId.value },
            data: {
                items: updatedItems,
            },
        });
    }

    async removeMedia(postMediaId: Uuid4, itemId: Uuid4): Promise<void> {
        const items = (await this.getMediaItems(
            postMediaId,
            'asPrimitives',
        )) as MediaItemPrimitives[];

        const updatedItems = items.filter((i: MediaItemPrimitives) => i.id !== itemId.value) as any;

        await this.prisma.postMedia.update({
            where: { id: postMediaId.value },
            data: {
                items: updatedItems,
            },
        });
    }

    async delete(id: Uuid4): Promise<boolean> {
        try {
            await this.prisma.post.update({
                where: { id: id.value },
                data: {
                    status: 'DELETED',
                    deletedAt: new Date(),
                },
            });

            return true;
        } catch (err: unknown) {
            //future logging
            console.error(err);
            return false;
        }
    }

    async existsById(postId: Uuid4): Promise<boolean> {
        const count = await this.prisma.post.count({
            where: { id: postId.value },
        });
        return count > 0;
    }

    async findById(id: Uuid4): Promise<Post | null> {
        const post = await this.prisma.post.findUnique({
            where: { id: id.value },
            include: { media: true, author: true },
        });
        if (!post) return null;

        return this.mapper.toEntity(post as any);
    }

    async getTagsById(id: Uuid4): Promise<PostTags | null> {
        const post = await this.prisma.post.findFirst({
            where: { id: id.value },
            select: { tags: true },
        });

        if (post === null) {
            return null;
        }

        return PostTags.create(post.tags);
    }

    async getMediaById(postId: Uuid4): Promise<PostMedia | null> {
        const postMedia = await this.prisma.postMedia.findFirst({
            where: { postId: postId.value },
            select: { items: true, postId: true },
        });
        console.log(`post media from db: `, postMedia);

        if (!postMedia) {
            return null;
        }

        return PostMedia.fromDbRecord(postMedia as any);
    }

    async findAllByUser(userId: Uuid4, offset: number, limit: number): Promise<PostCollection> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId.value },
            include: { media: true, author: true },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return this.mapper.toCollection(posts as any);
    }

    async findAll(offset: number, limit: number): Promise<PostCollection> {
        const posts = await this.prisma.post.findMany({
            include: { media: true, author: true },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return this.mapper.toCollection(posts as any);
    }

    async findByTags(tags: PostTags, offset: number, limit: number): Promise<PostCollection> {
        const posts = await this.prisma.post.findMany({
            where: {
                tags: { hasSome: tags.toArray() },
            },
            include: { media: true, author: true },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return this.mapper.toCollection(posts as any);
    }

    async addTags(id: Uuid4, tags: PostTags): Promise<void> {
        const post = await this.prisma.post.findUnique({ where: { id: id.value } });
        if (!post) throw new NotFoundException('Post not found');

        const currentTags = post.tags ?? [];
        const newTags = Array.from(new Set([...currentTags, ...tags.toArray()]));

        await this.prisma.post.update({
            where: { id: id.value },
            data: { tags: newTags },
        });
    }

    async removeTag(id: Uuid4, tags: PostTags): Promise<void> {
        await this.prisma.post.update({
            where: { id: id.value },
            data: { tags: tags.toArray() },
        });
    }
}
