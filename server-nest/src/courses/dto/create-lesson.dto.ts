import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    content_text?: string;

    @IsUrl()
    @IsOptional()
    video_url?: string;

    @IsInt()
    @Min(0)
    order_index: number;
}
