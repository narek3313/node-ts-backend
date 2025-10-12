import { EntityCollection } from 'src/shared/domain/entity.collection';
import { User } from 'src/modules/users/domain/user.entity';
/*
 * User collection used when there is a need of working with a User array
 *
 * Constructor creates additional hashmaps to enable O(1) lookups by username and email.
 * */
export class UserCollection extends EntityCollection<User> {
    private _byEmail: Map<string, User>;
    private _byUsername: Map<string, User>;

    private constructor(users: User[]) {
        super(users);

        this._byEmail = new Map(users.map((u) => [u.email.value, u]));
        this._byUsername = new Map(users.map((u) => [u.username.value, u]));
    }

    public static create(users: User[]): UserCollection {
        return new UserCollection(users);
    }

    public getByEmail(email: string): User | undefined {
        return this._byEmail.get(email);
    }

    public getByUsername(username: string): User | undefined {
        return this._byUsername.get(username);
    }

    public hasEmail(email: string): boolean {
        return this._byEmail.has(email);
    }

    public hasUsername(username: string): boolean {
        return this._byUsername.has(username);
    }
}
