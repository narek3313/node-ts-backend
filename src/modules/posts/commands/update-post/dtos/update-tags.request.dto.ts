import { IsArray, IsString } from 'class-validator';

export class AddTagsDto {
    @IsArray()
    @IsString({ each: true })
    tags: string[];
}

export class RemoveTagsDto {
    @IsString()
    tag: string;
}
