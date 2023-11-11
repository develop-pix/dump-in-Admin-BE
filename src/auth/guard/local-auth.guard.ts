import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // private readonly logger: Logger;
  /**
   * @desc 로그인 요청을 처리하는 가드 역할
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await super.canActivate(context);
    if (req) {
      const request = context.switchToHttp().getRequest();
      // this.logger.log('login for cookie');
      await super.logIn(request);
    }
    return true;
  }
}
