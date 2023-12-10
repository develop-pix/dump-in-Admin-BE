import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class AdminCheckGuard implements CanActivate {
  private readonly logger: Logger = new Logger();
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.session.user;

    this.logger.log(`${request.url}-${typeof userInfo}`);

    if (!userInfo.isAdmin) {
      throw new BadRequestException('로그인이 필요합니다.');
    }

    return true;
  }
}
