import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class LoggedCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.session.user;
    const isLoginRequest = request.url.includes('login');
    const isLogoutRequest = request.url.includes('logout');

    if (isLoginRequest && userInfo) {
      throw new BadRequestException('이미 로그인한 사용자입니다.');
    }

    if (isLogoutRequest && !userInfo) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    return true;
  }
}
