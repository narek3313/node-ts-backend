import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class IdResponse {
    constructor(public readonly id: Uuid4) {
        this.id = id;
    }
}
