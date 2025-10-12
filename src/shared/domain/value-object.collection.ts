import { ArgumentInvalidException } from 'src/libs/exceptions/exceptions';

/**
 * Abstract base class for managing a collection of value objects.
 * Ensures immutability and prevents duplicates.
 */
export abstract class ValueObjectCollection<T> {
    protected constructor(protected readonly items: T[] = []) {}

    /**
     * Adds a new item if it doesn't already exist.
     * @throws {ArgumentInvalidException} If the item already exists.
     */
    add(item: T): this {
        if (this.items.some((i) => this.equals(i, item))) {
            throw new ArgumentInvalidException('Duplicate item');
        }
        return this.clone([...this.items, item]);
    }

    /**
     * Removes an item from the collection.
     */
    remove(item: T): this {
        return this.clone(this.items.filter((i) => !this.equals(i, item)));
    }

    /**
     * Returns a copy of all items.
     */
    toArray(): T[] {
        return [...this.items];
    }

    /**
     * Returns the number of items in the collection.
     */
    count(): number {
        return this.items.length;
    }

    /**
     * Checks equality between two items.
     */
    protected abstract equals(a: T, b: T): boolean;

    /**
     * Creates a new instance with the given items.
     */
    protected abstract clone(items: T[]): this;
}
