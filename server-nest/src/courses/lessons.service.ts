import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async create(moduleId: string, dto: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: {
                ...dto,
                module_id: moduleId,
            },
        });
    }

    async update(id: string, dto: Partial<CreateLessonDto>) {
        return this.prisma.lesson.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.lesson.delete({
            where: { id },
        });
    }

    async reorder(ids: string[]) {
        const updates = ids.map((id, index) =>
            this.prisma.lesson.update({
                where: { id },
                data: { order_index: index },
            }),
        );
        return this.prisma.$transaction(updates);
    }
}
