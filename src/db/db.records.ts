export type userDbRecord = {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string | null;
    sessions: sessionDbRecord[];
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
