import { RoleType } from '../../auth/enums/role-type.enums';

export interface GetUserData {
  sub: string;

  email: string;

  role: RoleType;
}
