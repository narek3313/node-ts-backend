import { PostStatusEnum } from '@prisma/client';
import { MediaType } from 'src/libs/enums/post-media-type';

export type UserDbRecord = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string | null;
};

export type UserDbRecordArray = UserDbRecord[];

export type SessionDbRecord = {
    id: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    userAgent: string;
    ipAddress: string;
    revokedAt: Date | null;
};

export type SserDbRecordArray = UserDbRecord[];

export type PostDbRecord = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    status: PostStatusEnum;
    tags: string[];
    likesCount: number;
    viewsCount: number;
    commentsCount: number;
    media: PostMediaDbRecord;
    createdAt: Date;
    updatedAt: Date;
};

export type PostMediaItemDbRecord = {
    id: string;
    url: string;
    size: number;
    type: MediaType;
    duration?: number;
};

export type PostMediaDbRecord = {
    id: string;
    postId: string;
    items: PostMediaItemDbRecord[];
};

export type PostDbRecordArray = PostDbRecord[];

export type UserAuthDbRecord = {
    auth: {
        userId: string;
        password: string;
        lastPasswordChange: Date | null;
    };
    role: 'user' | 'admin' | 'moderator';
};

export type CommentDbRecord = {
    id: string;
    postId: string;
    authorId: string;
    parentId?: string | null;
    createdAt: Date;
    updatedAt: Date;
    likesCount: number;
    content: string;
    repliesCount: number;
    parent?: CommentDbRecord;
    replies?: CommentDbRecord[];
};
