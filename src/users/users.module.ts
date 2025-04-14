import { Module } from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
