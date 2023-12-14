import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.session.user;

    if (!userInfo) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return true;
  }
}
