import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GetAdminSessionDto } from '../user/dto/get-session-admin.dto';
import { UserService } from '../user/user.service';
import { AdminLogInProps } from './dto/post-login-req.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateAdminForLogIn(
    props: AdminLogInProps,
    session: Record<string, GetAdminSessionDto>,
  ): Promise<GetAdminSessionDto> {
    /**
     * @param props - 컨트롤러에서 받은 유저 정보 (username, password)
     * @desc - 유저 검증 로직
     *       - props에서 전달받은 비밀번호를 DB에 저장된 장고 패스워드와 비교
     */

    const admin = await this.userService.findOneAdminBy(props);
    const parsingDBPassword = admin.password.replace('bcrypt_sha256$', '');
    const isSamePassword = await bcrypt.compare(
      props.password,
      parsingDBPassword,
    );

    if (!isSamePassword) {
      throw new NotFoundException('관리자 정보를 찾지 못했습니다');
    }

    session.user = new GetAdminSessionDto(admin);
    return session.user;
  }
}
