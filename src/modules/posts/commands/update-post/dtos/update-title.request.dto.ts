import { IsString } from 'class-validator';

export class UpdateTitleRequestDto {
    @IsString()
    title: string;
}
