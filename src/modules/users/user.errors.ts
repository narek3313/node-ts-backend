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

export class InvalidPasswordError extends ExceptionBase {
    static readonly message = 'Invalid password';

    public readonly code = 'USER.INVLD_PSWRD';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidPasswordError.message, cause, metadata);
    }
}
