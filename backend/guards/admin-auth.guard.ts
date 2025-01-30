// guards/admin-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    if (!result) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.type !== 'admin') {
      throw new UnauthorizedException('Только для администраторов');
    }

    return true;
  }
}
