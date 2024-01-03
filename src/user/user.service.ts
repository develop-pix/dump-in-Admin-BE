import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @desc 전체 유저 목록 조회
   */
  findAllUser(page: PaginationProps): Promise<[User[], number]> {
    return this.userRepository.findUserByOptionAndCount(page);
  }

  /**
   * @param username - 유저아이디와 역할이 admin인 정보를 찾기
   * @desc 관리자에 대한 데이터 반환
   */
  async findOneAdminBy(username: string): Promise<User> {
    return this.userRepository.findOneUser(User.adminOf(username));
  }
}
