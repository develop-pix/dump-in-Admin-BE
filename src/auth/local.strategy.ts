import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetSessionAdminDto } from 'src/user/dto/get-session-admin.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }
  /**
   * @param username - 유저 아이디
   * @param password - 유저 비밀번호
   * @desc 사용자의 아이디와 비밀번호를 사용하여 로그인 인증을 수행하는 데 사용
   */

  async validate(
    username: string,
    password: string,
    done: CallableFunction,
  ): Promise<GetSessionAdminDto> {
    const user = await this.authService.validateAdmin(username, password);
    return done(null, user);
  }
}
