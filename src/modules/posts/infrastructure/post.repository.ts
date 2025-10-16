import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { PostRepositoryContract } from '../domain/repository.contract';
import { Post } from '../domain/post.entity';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Title } from '../domain/value-objects/title.vo';
import { Content } from '../domain/value-objects/content.vo';
import { PostStatus } from '../domain/value-objects/post-status.vo';
import { MediaCollection } from '../domain/value-objects/media-collection.vo';
import { PostMapper } from '../post.mapper';
import { PostCollection } from '../domain/collections/posts.collection';
import { PostTags } from '../domain/value-objects/post-tags.vo';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostRepository implements PostRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: PostMapper,
    ) {}

    async create(_post: Post, postMediaId: Uuid4): Promise<IdResponse> {
        const { media, ...postData } = _post.toObject();
        const id = postMediaId.value;

        await this.prisma.post.create({
            data: {
                ...postData,
                media: {
                    create: [
                        {
                            id,
                            items: media ?? [],
                        },
                    ],
                },
            },
        });

        return new IdResponse(_post.id);
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

    async addMedia(id: Uuid4, _media: MediaCollection): Promise<void> {
        const media = _media.toObjectArray();
        await this.prisma.postMedia.updateMany({
            where: { postId: id.value },
            data: {
                items: {
                    push: media,
                },
            },
        });
    }

    async removeMedia(postId: Uuid4, mediaId: Uuid4): Promise<void> {
        const postMedia = await this.prisma.postMedia.findFirst({
            where: { postId: postId.value },
        });
        if (!postMedia) return;

        const updatedItems = (postMedia.items as { id: string }[]).filter(
            (item) => item.id !== mediaId.value,
        );

        await this.prisma.postMedia.update({
            where: { id: postMedia.id },
            data: { items: updatedItems },
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
        return this.mapper.toEntity(post);
    }

    async findAllByUser(userId: Uuid4, offset: number, limit: number): Promise<PostCollection> {
        const posts = await this.prisma.post.findMany({
            where: { authorId: userId.value },
            include: { media: true, author: true },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return this.mapper.toCollection(posts);
    }

    async findAll(offset: number, limit: number): Promise<PostCollection> {
        const posts = await this.prisma.post.findMany({
            include: { media: true, author: true },
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return this.mapper.toCollection(posts);
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
        return this.mapper.toCollection(posts);
    }
}
