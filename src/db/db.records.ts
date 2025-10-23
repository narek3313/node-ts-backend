export type userDbRecord = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string | null;
};

export type sessionDbRecord = {
    id: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    userAgent: string;
    ipAddress: string;
    revokedAt: Date | null;
};

export type userDbRecordArray = userDbRecord[];

export type postDbRecord = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    status: string;
    tags: string[];
    likesCount: number;
    viewsCount: number;
    commentsCount: number;
    media: object[];
    createdAt: Date;
    updatedAt: Date;
};

export type postDbRecordArray = postDbRecord[];

export type userAuthDbRecord = {
    auth: {
        userId: string;
        password: string;
        lastPasswordChange: Date | null;
        failedLoginAttempts: number;
    };
    role: 'user' | 'admin' | 'moderator';
};
