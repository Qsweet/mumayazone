import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsInt()
    @Min(0)
    price: number; // in cents

    @IsString()
    @IsOptional()
    cover_image_url?: string;

    @IsBoolean()
    @IsOptional()
    is_published?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categoryIds?: string[];
}
