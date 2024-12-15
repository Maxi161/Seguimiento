import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/helpers/roles.enum';

Injectable();
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requireRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
        'roles',
        [context.getHandler(), context.getClass()],
      );

      const request = context.switchToHttp().getRequest();
      const user = request.body.user;
      const hasRole = () => {
        return requireRoles.some((role) => user?.role?.includes(role));
      };

      const valid = user && user.role && hasRole();

      if (!valid) {
        throw new HttpException(
          { status: 401, error: 'Unauthorized user' },
          401,
        );
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
