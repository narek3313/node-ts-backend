import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class InvalidCredentialsError extends ExceptionBase {
    static readonly message = 'Invalid credentials';

    public readonly code = 'AUTH.INVALID_CREDENTIALS';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidCredentialsError.message, cause, metadata);
    }
}

export class UnauthorizedError extends ExceptionBase {
    static readonly message = 'Unauthorized';

    public readonly code = 'AUTH.UNAUTHORIZED';

    constructor(cause?: Error, metadata?: unknown) {
        super(UnauthorizedError.message, cause, metadata);
    }
}
