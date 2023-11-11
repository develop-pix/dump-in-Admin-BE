import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  /**
   * @desc 세션이 살아있을 때 로그인되어 있는지(쿠키)를 확인하는 역할
   */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
