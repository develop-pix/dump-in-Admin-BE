import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { LoginAdmin } from './dto/post-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * @param props - 유저 정보 (username, password)
   * @desc - 유저 검증 로직
   *       - props에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  async login(props: LoginAdmin): Promise<User> {
    return this.userService.findOneAdminBy(props.username);
  }

  async verifyCredentials(
    credentials: Required<LoginAdmin>,
    property: string,
  ): Promise<boolean> {
    const user = await this.userService.findOneAdminBy(credentials.username);

    if (!user) return false;
    if (property !== 'password') return true;

    return User.comparePassword(credentials.password, user.password);
  }
}
