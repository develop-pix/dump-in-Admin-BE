import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminSignInProps, User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @desc 전체 유저 목록 조회
   */
  async findAllUser(page: PaginationProps): Promise<[GetUserDto[], number]> {
    const [results, count] =
      await this.userRepository.findUserByOptionAndCount(page);

    if (count === 0) {
      throw new NotFoundException('유저 목록이 없습니다.');
    }
    return [results.map((result: User) => new GetUserDto(result)), count];
  }

  /**
   * @param props - 유저아이디와 역할이 admin인 정보를 찾기
   * @desc 관리자에 대한 데이터 반환
   */
  async findOneAdminBy(props: AdminSignInProps): Promise<User> {
    const admin = await this.userRepository.findOneUserBy(User.adminOf(props));

    if (!admin) {
      throw new NotFoundException('관리자 정보를 찾지 못했습니다');
    }

    return admin;
  }
}
