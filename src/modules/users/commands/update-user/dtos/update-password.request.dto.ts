import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/libs/regex';

export class UpdatePasswordDto {
    @ApiProperty({
        example: 'NewStrongPass123!',
        description: 'New password (8–64 characters) matching PASSWORD_REGEX',
        minLength: 8,
        maxLength: 64,
    })
    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX, { message: 'Wrong password format' })
    readonly newPassword: string;

    @ApiProperty({
        example: 'OldPass456!',
        description: 'Current password (8–64 characters) matching PASSWORD_REGEX',
        minLength: 8,
        maxLength: 64,
    })
    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX, { message: 'Wrong password format' })
    readonly oldPassword: string;
}
