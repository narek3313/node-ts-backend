import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class InvalidPostDataError extends ExceptionBase {
    static readonly message = 'Invalid post data';
    public readonly code = 'POST.INVALID_DATA';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidPostDataError.message, cause, metadata);
    }
}

export class PostNotFoundError extends ExceptionBase {
    static readonly message = 'Post not found';
    public readonly code = 'POST.NOT_FOUND';

    constructor(cause?: Error, metadata?: unknown) {
        super(PostNotFoundError.message, cause, metadata);
    }
}

export class PostStatusError extends ExceptionBase {
    static readonly message = 'Invalid post status';
    public readonly code = 'POST.STATUS_INVALID';

    constructor(cause?: Error, metadata?: unknown) {
        super(PostStatusError.message, cause, metadata);
    }
}
