import UserInterface from './user.interface';
import { UserRole } from '../enums/user-role.enum';
import { PickType } from '@nestjs/mapped-types';
import User from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

export class CreateUserOptions extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'role',
  'email',
  'password',
] as const) {}
