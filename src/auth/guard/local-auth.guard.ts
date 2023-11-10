import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger: Logger = new Logger();
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await super.canActivate(context);
    if (req) {
      const request = context.switchToHttp().getRequest();
      this.logger.log('login for cookie');
      await super.logIn(request);
    }
    return true;
  }
}