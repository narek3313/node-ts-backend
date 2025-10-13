import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';
import { ArgumentNotProvidedException } from '../exceptions/exceptions';
import { Guard } from '../utils/guard';

/**
 * Combines the properties of `T` (excluding `id` and `metadata`)
 * with the optional fields from the `Command` class.
 *
 * Effectively: T without `id` and `metadata`, plus `Partial<Command>`.
 */ export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

type CommandMetadata = {
    /**
     * Causation id to reconstruct execution order if needed
     */
    /**
     * My app design doesnt have Domain Events yet so this is not used
     * */
    readonly causationId?: string;

    /**
     * ID of a user who invoked the command. Can be useful for
     * logging and tracking execution of commands and events
     */
    readonly userId?: Uuid4;

    /**
     * Time when the command occurred. Mostly for tracing purposes
     */
    readonly timestamp: number;
};

export class Command {
    /**
     * Command id, in case if we want to save it
     * for auditing purposes and create a correlation/causation chain
     */
    readonly id: Uuid4;

    readonly metadata: CommandMetadata;

    constructor(props: CommandProps<unknown>) {
        if (Guard.isEmpty(props)) {
            throw new ArgumentNotProvidedException('Command props should not be empty');
        }

        this.id = Uuid4.create();

        this.metadata = {
            causationId: props?.metadata?.causationId,
            timestamp: props?.metadata?.timestamp || Date.now(),
            userId: props?.metadata?.userId,
        };
    }
}
