// guards/admin-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    console.log('hello1');
    const result = await super.canActivate(context);
    console.log(result, 'result');
    if (!result) return false;

    const request = context.switchToHttp().getRequest();
    console.log(request, 'req');
    const user = request.user;

    console.log(user, 'user');
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Только для администраторов');
    }

    return true;
  }
}
