import { PrismaService } from 'src/db/prisma/prisma.service';
import { CommentsRepositoryContract } from '../domain/repository.contract';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { Comment, CommentIds } from '../comment.entity';
import { CommentCreateError, CommentNotFoundError } from '../comment.errors';
import { CommentMapper } from '../comment.mapper';
import { CommentDbRecord } from 'src/db/db.records';
import { Injectable } from '@nestjs/common';
import { Content } from 'src/modules/posts/domain/value-objects/content.vo';

@Injectable()
export class CommentRepository implements CommentsRepositoryContract {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mapper: CommentMapper,
    ) {}

    async create(_comment: Comment): Promise<Uuid4> {
        try {
            const { replies, ...comment } = _comment.toObject();

            await this.prisma.comment.create({
                data: { ...comment },
            });
            return _comment.id;
        } catch (err) {
            console.log(err);
            throw new CommentCreateError();
        }
    }

    async getPostIdbyId(id: Uuid4): Promise<Uuid4 | null> {
        const result = await this.prisma.comment.findFirst({
            where: { id: id.value },
            select: { postId: true },
        });

        if (!result) {
            return null;
        }

        return Uuid4.from(result.postId);
    }

    async findByIds(ids: Uuid4[]): Promise<Comment[] | null> {
        if (!ids.length) return null;

        const comments = await this.prisma.comment.findMany({
            where: { id: { in: ids.map((i) => i.value) } },
        });

        if (!comments.length) return null;

        return this.mapper.toArray(comments);
    }

    async getIdsById(id: Uuid4): Promise<CommentIds | null> {
        const comment = await this.prisma.comment.findFirst({
            where: { id: id.value },
            select: { id: true, parentId: true, authorId: true, postId: true },
        });

        if (!comment) {
            return null;
        }

        return {
            id: Uuid4.from(comment.id),
            parentId: comment.parentId ? Uuid4.from(comment.parentId) : undefined,
            authorId: Uuid4.from(comment.authorId),
            postId: Uuid4.from(comment.postId),
        };
    }

    async findById(id: Uuid4): Promise<Comment | null> {
        const comment = await this.prisma.comment.findFirst({
            where: { id: id.value },
        });

        if (!comment) {
            return null;
        }

        return this.mapper.toEntity(comment);
    }

    async delete(id: Uuid4): Promise<boolean> {
        try {
            await this.prisma.comment.delete({
                where: { id: id.value },
            });

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async findByUser(userId: Uuid4, offset: number, limit: number): Promise<Comment[] | null> {
        try {
            const comments: CommentDbRecord[] = await this.prisma.comment.findMany({
                where: { authorId: userId.value },
                skip: offset,
                take: limit,
            });

            if (!comments) {
                return null;
            }

            return this.mapper.toArray(comments);
        } catch (err) {
            throw new CommentNotFoundError(err);
        }
    }
    async findByPost(postId: Uuid4, offset: number, limit: number): Promise<Comment[] | null> {
        try {
            const comments: CommentDbRecord[] = await this.prisma.comment.findMany({
                where: { postId: postId.value },
                skip: offset,
                take: limit,
            });

            if (!comments) {
                return null;
            }

            return this.mapper.toArray(comments);
        } catch (err) {
            throw new CommentNotFoundError(err);
        }
    }

    async findReplies(parentId: Uuid4): Promise<Comment[] | null> {
        try {
            const replies = await this.prisma.comment.findMany({
                where: { parentId: parentId.value },
            });

            if (!replies) {
                return null;
            }

            return this.mapper.toArray(replies);
        } catch (err) {
            throw new CommentNotFoundError(err);
        }
    }

    async existsById(commentId: Uuid4): Promise<Uuid4 | null> {
        const comment = await this.prisma.comment.findFirst({
            where: { id: commentId.value },
        });

        if (!comment) {
            return null;
        }

        return commentId;
    }

    async getAuthorIdById(commentId: Uuid4): Promise<Uuid4 | null> {
        const result = await this.prisma.comment.findUnique({
            where: { id: commentId.value },
            select: { authorId: true },
        });

        if (!result) {
            return null;
        }

        return Uuid4.from(result.authorId);
    }

    async updateContent(commentId: Uuid4, newContent: Content): Promise<void> {
        await this.prisma.comment.update({
            where: { id: commentId.value },
            data: { content: newContent.value },
        });
    }
}
