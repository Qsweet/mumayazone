import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/dto/create-user.dto';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateModuleDto } from './dto/create-module.dto';
import { ReorderDto } from './dto/reorder.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { LessonsService } from './lessons.service';
import { ModulesService } from './modules.service';

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly modulesService: ModulesService,
        private readonly lessonsService: LessonsService,
    ) { }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    create(@Body() createCourseDto: CreateCourseDto, @Req() req: any) {
        return this.coursesService.create(createCourseDto, req.user.userId);
    }

    @Get()
    findAll() {
        return this.coursesService.findAll();
    }

    @Get('my-courses')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR)
    findMyCourses(@Req() req: any) {
        return this.coursesService.findAllByInstructor(req.user.userId);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.coursesService.findOne(slug);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Patch(':id/publish')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    publish(@Param('id') id: string) {
        return this.coursesService.publish(id);
    }

    @Patch(':id/unpublish')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    unpublish(@Param('id') id: string) {
        return this.coursesService.unpublish(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    remove(@Param('id') id: string) {
        // TODO: Check ownership if not admin
        return this.coursesService.remove(id);
    }
    @Patch(':id/modules/reorder')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    reorderModules(@Body() dto: ReorderDto) {
        return this.modulesService.reorder(dto.ids);
    }

    @Post(':id/modules')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    addModule(@Param('id') id: string, @Body() dto: CreateModuleDto) {
        return this.modulesService.create(id, dto);
    }

    @Patch('modules/:id/lessons/reorder')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    reorderLessons(@Body() dto: ReorderDto) {
        return this.lessonsService.reorder(dto.ids);
    }

    @Post('modules/:id/lessons')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
    addLesson(@Param('id') id: string, @Body() dto: CreateLessonDto) {
        return this.lessonsService.create(id, dto);
    }
}
