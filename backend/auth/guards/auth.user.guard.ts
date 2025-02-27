import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// guards/user-auth.guard.ts
@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    if (!result) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'user') {
      throw new UnauthorizedException('Access denied. User role required.');
    }

    return true;
  }
}
