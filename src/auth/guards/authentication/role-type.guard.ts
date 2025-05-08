import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_TYPE_KEY } from '../../constants/auth.constants';
import { RoleType } from '../../enums/role-type.enums';
import ActiveUser from '../../interfaces/request-active-user.interface';
import { GetUserData } from '../../interfaces/get-user-data.inteface';

@Injectable()
export class RoleTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private static readonly defaultRoleType = RoleType.ADMIN;

  canActivate(context: ExecutionContext): boolean {
    const roleTypes: RoleType[] = this.reflector.getAllAndOverride<RoleType[]>(
      ROLE_TYPE_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!roleTypes) {
      return true;
    }

    const user = context.switchToHttp().getRequest<ActiveUser>().user;

    const hasRole = RoleTypeGuard.matchRoles(user, roleTypes);

    if (!hasRole) {
      throw new ForbiddenException('Forbidden Operation', {
        description: 'You are not allowed to perform this operation',
      });
    }

    return true;
  }

  private static matchRoles(
    user: GetUserData,
    allowedRoles: RoleType[],
  ): boolean {
    return allowedRoles.includes(user.role);
  }
}
