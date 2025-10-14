import { Uuid4 } from './value-objects/uuid.vo';

/**
 * Abstract base class for managing a collection of entities identified by UUID.
 * Provides basic CRUD-like operations using an internal Map.
 */
export abstract class EntityCollection<T extends { id: Uuid4 }> {
    protected readonly items: Map<string, T> = new Map();

    protected _page: number = 1;
    protected _limit: number = 10;
    protected _totalItems: number = 0;

    /**
     * Sets pagination info for this collection.
     * @param page Current page number (1-based)
     * @param limit Number of items per page
     * @param totalItems Total number of items across all pages
     */
    setPagination(page: number, limit: number, totalItems: number): void {
        this._page = page;
        this._limit = limit;
        this._totalItems = totalItems;
    }

    /**
     * Initializes the collection with optional entities.
     */
    protected constructor(initialItems: T[] = []) {
        initialItems.forEach((item) => this.items.set(item.id.value, item));
    }

    /**
     * Adds a new entity to the collection.
     * @throws {Error} If an entity with the same ID already exists.
     */
    add(entity: T): void {
        const key = entity.id.value;
        if (this.items.has(key)) {
            throw new Error(`Entity with id ${key} already exists`);
        }
        this.items.set(key, entity);
    }

    /**
     * Removes an entity by its ID.
     */
    remove(entityId: Uuid4): void {
        this.items.delete(entityId.value);
    }

    /**
     * Retrieves an entity by its ID.
     */
    getById(entityId: Uuid4): T | undefined {
        return this.items.get(entityId.value);
    }

    /**
     * Checks if an entity exists in the collection.
     */
    has(entityId: Uuid4): boolean {
        return this.items.has(entityId.value);
    }

    /**
     * Returns all entities as an array.
     */
    getAll(): T[] {
        return Array.from(this.items.values());
    }

    /**
     * Number of entities in the collection.
     */
    get count(): number {
        return this.items.size;
    }
}
