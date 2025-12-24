import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// PrismaModule is global, no need to import

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
