import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';
import { AuthType } from '../../enums/auth-type.enums';
import { AuthenticationGuard } from './authentication.guard';

@Injectable()
export class AuthTypeGuard implements CanActivate {
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;
  constructor(
    /**
     * Import Reflector
     */
    private reflector: Reflector,
    /**
     * Import Authentication Guard
     */
    private readonly authenticationGuard: AuthenticationGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.BEARER]: this.authenticationGuard,
      [AuthType.NONE]: {
        canActivate(): boolean {
          return true;
        },
      },
    };
  }

  private static readonly defaultAuthType = AuthType.BEARER;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes: AuthType[] = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getClass(), context.getHandler()],
    ) ?? [AuthTypeGuard.defaultAuthType];

    console.log(authTypes);

    const guards: CanActivate[] = authTypes
      .map((type) => this.authTypeGuardMap[type])
      .flat();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((error) => {
        console.error(error);
      });

      if (canActivate) {
        return true;
      }
    }
    throw new UnauthorizedException();
  }
}
