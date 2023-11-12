import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger();
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.session.user;
    this.logger.log(userInfo);

    if (!request.session.user) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    return true;
  }
}
