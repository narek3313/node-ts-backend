import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';
import { MAX_POST_CONTENT_SIZE, MIN_POST_CONTENT_SIZE } from 'src/shared/domain/constants';

/**
 * Domain representation of Post Content
 *
 * This value object encapsulates the textual body of a post.
 * It enforces the domain invariants for what constitutes valid content.
 *
 * ## Responsibilities
 * - Guarantees that content is a non-empty string.
 * - Ensures minimum and maximum length constraints.
 * - Normalizes input (trims leading/trailing whitespace).
 * - Provides an immutable, validated representation within the domain.
 *
 * ## Length constraints
 * - Minimum: 5 characters — prevents meaningless or spammy posts.
 * - Maximum: 5000 characters — guards against abuse and payload overflow.
 *
 * ## Notes
 * - This class does not perform HTML sanitization or encoding.
 *   Such operations belong to the infrastructure or presentation layers.
 * - Instances can only be created via the `Content.create()` factory method,
 *   ensuring all domain rules are enforced at construction time.
 */
export class Content {
    private constructor(private readonly _value: string) {}

    static create(raw: string): Content {
        if (!raw || typeof raw !== 'string') {
            throw new ArgumentInvalidException('Post content must be non-empty string');
        }

        const trimmed = raw.trim();

        if (trimmed.length < MIN_POST_CONTENT_SIZE) {
            throw new ArgumentInvalidException('Post content is too short');
        }

        if (trimmed.length > MAX_POST_CONTENT_SIZE) {
            throw new ArgumentInvalidException('Post content is too long');
        }

        return new Content(trimmed);
    }

    get value(): string {
        return this._value;
    }
}
