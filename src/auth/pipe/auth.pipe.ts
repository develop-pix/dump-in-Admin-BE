import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginAdmin } from '../dto/post-login.dto';
import { GetAdminSession } from '../dto/get-admin-session.dto';

/**
 * Validator supports service container in the case if want to inject dependencies into your custom validator constraint classes
 * @see also https://github.com/leosuncin/nest-api-example/blob/master/src/blog/pipes/article.pipe.ts
 * @see also https://github.com/typestack/class-validator?tab=readme-ov-file#using-service-container
 * @see also https://docs.nestjs.com/techniques/validation
 */
@Injectable()
export class AuthPipe
  implements PipeTransform<LoginAdmin, Promise<GetAdminSession>>
{
  constructor(private readonly authService: AuthService) {}

  async transform(value: LoginAdmin) {
    const admin = await this.authService.login(value);
    const isSamePassword = await this.authService.verifyCredentials(
      value,
      admin,
    );

    if (!isSamePassword) {
      throw new UnauthorizedException(`아이디나 비밀번호가 일치하지 않습니다.`);
    }

    return new GetAdminSession(admin);
  }
}
