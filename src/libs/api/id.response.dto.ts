import { ApiProperty } from '@nestjs/swagger';
import { Uuid4 } from 'src/shared/domain/value-objects/uuid.vo';

export class IdResponse {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Unique identifier of the created or affected resource (UUID v4)',
    })
    readonly id: Uuid4;

    constructor(id: Uuid4) {
        this.id = id;
    }
}
