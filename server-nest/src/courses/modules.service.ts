import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';

@Injectable()
export class ModulesService {
    constructor(private prisma: PrismaService) { }

    async create(courseId: string, dto: CreateModuleDto) {
        return this.prisma.contentModule.create({
            data: {
                ...dto,
                course_id: courseId,
            },
        });
    }

    async update(id: string, dto: Partial<CreateModuleDto>) {
        return this.prisma.contentModule.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.contentModule.delete({
            where: { id },
        });
    }

    async reorder(ids: string[]) {
        const updates = ids.map((id, index) =>
            this.prisma.contentModule.update({
                where: { id },
                data: { order_index: index },
            }),
        );
        return this.prisma.$transaction(updates);
    }
}
