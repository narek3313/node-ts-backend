import { ApiProperty } from '@nestjs/swagger';

export class FindUserResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Unique user ID' })
    id: string;

    @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
    username: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    email: string;

    @ApiProperty({
        example: '2025-10-23T15:00:00Z',
        description: 'Date when user was last updated',
    })
    updatedAt: Date;

    @ApiProperty({ example: '2025-10-23T15:00:00Z', description: 'Date when user was created' })
    createdAt: Date;

    @ApiProperty({
        example: 'https://example.com/avatars/john.png',
        description: 'Avatar URL',
        nullable: true,
    })
    avatar: string | null;

    constructor(data: {
        id: string;
        username: string;
        email: string;
        updatedAt: Date;
        createdAt: Date;
        avatar: string | null;
    }) {
        Object.assign(this, data);
    }
}
