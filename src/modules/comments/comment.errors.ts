import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class CommentCreateError extends ExceptionBase {
    static readonly message = 'Failed to create comment';

    public readonly code = 'COMMENT.CREATE_ERROR';

    constructor(cause?: Error, metadata?: unknown) {
        super(CommentCreateError.message, cause, metadata);
    }
}
