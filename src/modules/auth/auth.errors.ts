import { ExceptionBase } from 'src/libs/exceptions/exception.base';

export class InvalidCredentialsError extends ExceptionBase {
    static readonly message = 'Invalid credentials';

    public readonly code = 'AUTH.INVALID_CREDENTIALS';

    constructor(cause?: Error, metadata?: unknown) {
        super(InvalidCredentialsError.message, cause, metadata);
    }
}
