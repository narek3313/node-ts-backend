import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class CommentCreateError extends ExceptionBase {
    static readonly message = 'Failed to create comment';

    public readonly code = 'COMMENT.CREATE_ERROR';

    constructor(cause?: Error, metadata?: unknown) {
        super(CommentCreateError.message, cause, metadata);
    }
}

export class CommentDeleteError extends ExceptionBase {
    static readonly message = 'Failed to delete comment';

    public readonly code = 'COMMENT.DELETE_ERROR';

    constructor(cause?: Error, metadata?: unknown) {
        super(CommentDeleteError.message, cause, metadata);
    }
}

export class CommentNotFoundError extends ExceptionBase {
    static readonly message = 'Comment not found';
    public readonly code = 'COMMENT.NOT_FOUND';

    constructor(cause?: Error, metadata?: unknown) {
        super(CommentNotFoundError.message, cause, metadata);
    }
}

export class CommentUpdateError extends ExceptionBase {
    static readonly message = 'Failed to update comment';
    public readonly code = 'COMMENT.UPDATE_ERROR';

    constructor(cause?: Error, metadata?: unknown) {
        super(CommentUpdateError.message, cause, metadata);
    }
}
