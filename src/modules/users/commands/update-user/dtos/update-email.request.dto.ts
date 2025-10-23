import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
    @ApiProperty({
        example: 'new.email@example.com',
        description: 'New valid email address for the user',
    })
    @IsEmail()
    readonly email: string;
}
