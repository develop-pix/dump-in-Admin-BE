import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetAdminSessionDto } from '../dto/get-admin-session.dto';

@Injectable()
export class LoggedCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo: GetAdminSessionDto = request.session.user;
    const isLoginRequest = request.url.includes('login');

    if (isLoginRequest && userInfo) {
      throw new BadRequestException('이미 로그인한 사용자입니다.');
    }

    if (!isLoginRequest && !userInfo) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return true;
  }
}
