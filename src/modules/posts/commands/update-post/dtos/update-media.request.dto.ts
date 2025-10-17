import {
    IsArray,
    IsOptional,
    IsString,
    IsUrl,
    IsEnum,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { MediaType } from 'src/libs/enums/post-media-type';
import { z } from 'zod';

const urlValidator = (val: string) => {
    try {
        new URL(val);
        return true;
    } catch {
        return false;
    }
};

export const MediaItemSchema = z.object({
    url: z.string().refine(urlValidator, {
        message: 'Invalid URL',
    }),
    type: z.enum(Object.values(MediaType) as [string, ...string[]]),
    size: z.number().positive(),
    duration: z.number().positive().optional(),
});

export const MediaArraySchema = z.array(MediaItemSchema);

export type MediaItem = z.infer<typeof MediaItemSchema>;
export type MediaArray = z.infer<typeof MediaArraySchema>;

export class MediaItemDto {
    @IsString()
    @IsUrl()
    url: string;

    @IsEnum(MediaType)
    type: MediaType;

    @IsNumber()
    size: number;

    @IsOptional()
    @IsNumber()
    duration?: number;
}

export class UpdateMediaDto {
    @IsArray()
    @ValidateNested({ each: true })
    items: MediaItemDto[];
}
