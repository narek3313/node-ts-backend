import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    readonly content: string;
}

export class CreateReplyRequestDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    readonly content: string;
}
