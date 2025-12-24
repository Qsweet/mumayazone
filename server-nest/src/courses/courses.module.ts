import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { LessonsService } from './lessons.service';
import { ModulesService } from './modules.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, ModulesService, LessonsService],
})
export class CoursesModule { }
