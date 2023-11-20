import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/repository/user.repository';
import {
  SessionAdminInfo,
  GetSessionAdminDto,
  RawAdmin,
} from '../user/dto/get-session-admin.dto';
import { Request, Response } from 'express';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async logInAndSetSession(
    user: User,
    session: Record<string, SessionAdminInfo>,
  ): Promise<SessionAdminInfo> {
    /**
     * @param user - 컨트롤러에서 받은 유저 정보 (username, password)
     * @param session - 세션에 넣을 정보
     * @desc 유저 로그인 정보와 세션에 유저 정보를 업데이트 하기 위한 로직
     */
    const admin = await this.findAdminByUsername(user.username);

    await this.validateAdminForLogin(admin.password, user.password);

    const sessionUser = new GetSessionAdminDto(admin);
    return this.setSessionUser(session, sessionUser);
  }

  private async findAdminByUsername(username: string): Promise<RawAdmin> {
    /**
     * @param username - 로그인에서 요청 받은 유저 아이디
     * @desc 요청 받은 유저 아이디가 있는지, 어드민 유저 인지 검증
     */
    const adminByUsername = await this.userRepository.findByUsername(username);

    if (!adminByUsername) {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }

    if (!adminByUsername.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 없습니다');
    }

    return adminByUsername;
  }

  private async validateAdminForLogin(
    password: string,
    enteredPassword: string,
  ): Promise<void> {
    /**
     * @param password - DB에 있는 어드민 유저의 비밀번호
     * @param enteredPassword - 로그인에서 요청 받은 유저 비밀번호
     * @desc 비밀번호 비교 로직 장고 hasher와 비교
     */
    const parsingDBPassword = password.replace('bcrypt_sha256$', '');
    const isSamePassword = await bcrypt.compare(
      enteredPassword,
      parsingDBPassword,
    );

    if (!isSamePassword) {
      throw new ConflictException('관리자 정보가 일치하지 않습니다');
    }
  }

  private setSessionUser(
    session: Record<string, SessionAdminInfo>,
    user: GetSessionAdminDto,
  ): SessionAdminInfo {
    /**
     * @param session - 세션 객체
     * @param user - 세션에 넣을 유저 정보 객체
     * @desc 세션에 유저 정보를 넣습니다.
     */
    const { email, isAdmin, username } = user;
    session.user = { email, isAdmin, username };
    return session.user;
  }

  logOut(req: Request, res: Response): void {
    req.session.destroy((error) => {
      if (error) {
        throw new BadRequestException('세션 만료에 실패했습니다.');
      }
    });
    res.clearCookie('session-cookie');
    res.status(200).send();
  }
}
