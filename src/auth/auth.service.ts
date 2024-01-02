import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AdminLogInProps } from './dto/post-login.dto';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * @param props - 유저 정보 (username, password)
   * @desc - 유저 검증 로직
   *       - props에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  async validateAdminForLogIn(props: AdminLogInProps): Promise<User> {
    const admin = await this.userService.findOneAdminBy(props);
    await this.comparePassword(props.password, admin.password);
    return admin;
  }

  private async comparePassword(
    requestPassword: string,
    dbPassword: string,
  ): Promise<void> {
    const parsingDBPassword = dbPassword.replace('bcrypt_sha256$', '');
    const isSamePassword = await bcrypt.compare(
      requestPassword,
      parsingDBPassword,
    );

    if (!isSamePassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
  }
}
