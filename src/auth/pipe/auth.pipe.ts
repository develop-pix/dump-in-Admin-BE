import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginAdmin } from '../dto/post-login.dto';
import { GetAdminSession } from '../dto/get-admin-session.dto';

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
