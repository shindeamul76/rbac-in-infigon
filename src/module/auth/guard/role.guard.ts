import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const matchRoles = (roles, userRoles) => {
  return roles.some((role) => userRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()));
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest() as any;
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    const userRoles = user.role.map((item) => item.role.name);
    const hasRole = matchRoles(roles, userRoles);

    if (!hasRole) {
      throw new ForbiddenException('User does not have the required permissions.');
    }

    return true;
  }
}