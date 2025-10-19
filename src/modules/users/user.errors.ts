import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class UserAlreadyExistsError extends ExceptionBase {
    static readonly message = 'User already exists';

    public readonly code = 'USER.ALREADY_EXISTS';

    constructor(cause?: Error, metadata?: unknown) {
        super(UserAlreadyExistsError.message, cause, metadata);
    }
}

export class UniqueConstraintError extends ExceptionBase {
    static readonly message = 'Unique constraint error';

    public readonly code = 'USER.UNQ_CONSTRAINT';

    constructor(cause?: Error, metadata?: unknown) {
        super(UniqueConstraintError.message, cause, metadata);
    }
}

export class InvalidOldPasswordError extends ExceptionBase {
    static readonly message = 'Invalid old password';

    public readonly code = 'USER.INVALID_PASSWORD';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidOldPasswordError.message, cause, metadata);
    }
}

export class SamePasswordError extends ExceptionBase {
    static readonly message = 'New password can not be same as the old password';

    public readonly code = 'USER.SAME_PASSWORD';

    constructor(cause?: Error, metadata?: unknown) {
        super(SamePasswordError.message, cause, metadata);
    }
}
