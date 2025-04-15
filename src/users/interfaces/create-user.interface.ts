import { UserRole } from '../enums/user-role.enum';

export interface CreateUserOptions {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  role: UserRole;
  email: string;
  password: string;
  googleId?: string;
  profileImg?: string;
}
