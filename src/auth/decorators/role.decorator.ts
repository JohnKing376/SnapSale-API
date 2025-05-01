import { SetMetadata } from '@nestjs/common';
import { ROLE_TYPE_KEY } from '../constants/auth.constants';
import { RoleType } from '../enums/role-type.enums';

export const Role = (...roleTypes: RoleType[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleTypes);
