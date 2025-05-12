import { RoleType } from '../../auth/enums/role-type.enums';

export interface CreateUserOptions {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: RoleType;
  email: string;
  password: string;
  googleId?: string;
  profileImg?: string;
  isVerified?: boolean;
}
