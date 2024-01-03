import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { LoginAdmin } from './dto/post-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * @param request - 유저 정보 (username, password)
   * @desc - 유저 검증 로직
   *       - props에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  login(request: LoginAdmin): Promise<User> {
    return this.userService.findOneAdminBy(request.username);
  }

  /**
   * @param request - 유저 정보 (username, password)
   * @param admin - DB에 저장된 유저 정보
   * @desc - 관리자 검증 로직
   *       - credentials에서 전달받은 비밀번호를 DB에 저장된 정보와 비교
   */
  verifyCredentials(request: LoginAdmin, admin: User): Promise<boolean> {
    return User.comparePassword(request.password, admin.password);
  }
}
