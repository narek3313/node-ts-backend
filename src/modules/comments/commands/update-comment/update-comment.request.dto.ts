import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    readonly content: string;
}
