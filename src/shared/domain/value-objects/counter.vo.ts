import {
    ArgumentInvalidException,
    ArgumentOutOfRangeException,
} from 'src/libs/exceptions/exceptions';
import { Uuid4 } from './uuid.vo';

export interface CreateCounterProps {
    /** Optional ID; if not provided, a new one will be generated */
    id?: Uuid4;
    /** Initial count; must be 0 or positive */
    count: number;
}

/**
 * Counter VO used across the domain.
 *
 * Can be used for any domain counters like post views, likes, or similar.
 *
 * - ID is immutable.
 * - Count is mutable only through controlled operations (increment/decrement).
 * - Supports batch operations.
 * - Ensures non-negative counts.
 */
export class Counter {
    private _count: number;
    private readonly _id: Uuid4;

    /**
     * Private constructor. Use static factories to create instances.
     *
     * @param props - Initial count and optional ID
     */
    private constructor(props: CreateCounterProps) {
        if (props.count < 0) throw new ArgumentInvalidException('Count should be positive number');
        this._count = props.count;
        this._id = props.id ?? Uuid4.create();
    }

    /**
     * Factory method to create a zero counter.
     *
     * @param id - Optional ID; if not provided, a new ID is generated internally
     */
    static zero(id?: Uuid4): Counter {
        return new Counter({ count: 0, id });
    }

    static from(count: number, id?: Uuid4): Counter {
        return new Counter({ count, id });
    }

    /**
     * Increment count by 1.
     * Returns the current instance for chaining.
     */
    increment(): this {
        this._count += 1;
        return this;
    }

    /**
     * Decrement count by 1.
     * Throws EntityError if count would become negative.
     * Returns the current instance for chaining.
     */
    decrement(): this {
        if (this._count === 0) {
            throw new ArgumentOutOfRangeException('Cannot decrement under 0');
        }
        this._count -= 1;
        return this;
    }

    /**
     * Increment count by a specified positive amount.
     *
     * @param amount - Must be positive
     */
    incrementBy(amount: number): this {
        if (amount < 0) throw new ArgumentOutOfRangeException('Amount must be positive');
        this._count += amount;
        return this;
    }

    /**
     * Decrement count by a specified positive amount.
     * Throws EntityError if result would be negative.
     *
     * @param amount - Must be positive
     */
    decrementBy(amount: number): this {
        if (amount < 0) throw new ArgumentOutOfRangeException('Amount must be positive');
        if (this._count - amount < 0)
            throw new ArgumentOutOfRangeException('Cannot decrement below 0');
        this._count -= amount;
        return this;
    }

    /**
     * Create a new instance with the same ID and count.
     * Useful for creating a snapshot without modifying the original instance.
     */
    clone(): Counter {
        return new Counter({ count: this._count, id: this._id });
    }

    /**
     * Compare two counters for equality (same ID and same count)
     */
    equals(other: Counter): boolean {
        return this._count === other._count && this._id === other._id;
    }

    toJSON() {
        return { id: this._id, count: this._count };
    }

    /* getters */

    get count(): number {
        return this._count;
    }

    get id(): Uuid4 {
        return this._id;
    }
}
