import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto, instructorId: string) {
        const { categoryIds, ...rest } = createCourseDto;
        return this.prisma.course.create({
            data: {
                ...rest,
                instructor_id: instructorId,
                categories: categoryIds ? {
                    create: categoryIds.map(id => ({ category: { connect: { id } } }))
                } : undefined,
            },
        });
    }

    async findAll() {
        return this.prisma.course.findMany({
            where: { is_published: true },
            include: { instructor: { select: { name: true } } },
        });
    }

    async findAllByInstructor(instructorId: string) {
        return this.prisma.course.findMany({
            where: { instructor_id: instructorId },
        });
    }

    async findOne(slug: string) {
        const course = await this.prisma.course.findUnique({
            where: { slug },
            include: { modules: { include: { lessons: true } } },
        });
        if (!course) throw new NotFoundException(`Course with slug ${slug} not found`);
        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        const { categoryIds, ...rest } = updateCourseDto;
        return this.prisma.course.update({
            where: { id },
            data: {
                ...rest,
                categories: categoryIds ? {
                    deleteMany: {},
                    create: categoryIds.map(catId => ({ category: { connect: { id: catId } } }))
                } : undefined,
            },
        });
    }

    async publish(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: { modules: { include: { lessons: true } } },
        });

        if (!course) throw new NotFoundException(`Course not found`);

        if (!course.modules || course.modules.length === 0) {
            throw new BadRequestException('Course must have at least one module to be published');
        }

        const hasLessons = course.modules.some(m => m.lessons && m.lessons.length > 0);
        if (!hasLessons) {
            throw new BadRequestException('Course must have at least one lesson to be published');
        }

        return this.prisma.course.update({
            where: { id },
            data: { is_published: true },
        });
    }

    async unpublish(id: string) {
        return this.prisma.course.update({
            where: { id },
            data: { is_published: false },
        });
    }

    async remove(id: string) {
        return this.prisma.course.delete({
            where: { id },
        });
    }
}
