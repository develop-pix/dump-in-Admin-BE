import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UserRepository } from '../user/repository/user.repository';
import { GetSessionAdminDto } from '../user/dto/get-session-admin.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<GetSessionAdminDto> {
    /**
     * @param username - 유저 아이디
     * @param password - 유저 비밀번호
     * @desc 로그인 검증 로직을 수행하는 데 사용
     */
    const adminBy = await this.userRepository.findByUsername(username);

    if (!adminBy) {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }

    if (adminBy.group !== 'admin') {
      throw new UnauthorizedException('관리자 권한이 없습니다');
    }

    if (!compare(password, adminBy.password)) {
      throw new ConflictException('관리자 정보가 일치하지 않습니다');
    }
    //Return 값 변경
    return new GetSessionAdminDto(adminBy);
  }

  async logOut(req: Request) {
    req.logOut((err) => {
      if (err) {
        this.logger.error(err.stack);
        throw new ConflictException('로그아웃에 실패했습니다.');
      }
      req.session.destroy((err) => {
        if (err) {
          this.logger.error(err.stack);
          throw new ConflictException('세션 삭제를 실패했습니다.');
        }
      });
    });
  }
}
