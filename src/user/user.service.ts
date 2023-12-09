import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminSignInProps, User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { PaginationProps } from '../common/dto/pagination-req.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllUser(page: PaginationProps): Promise<[GetUserDto[], number]> {
    /**
     * @param pageProps - pagination - 항목수, 페이지
     * @desc - 전체 유저 목록 조회
     */

    const [results, count] = await this.userRepository.findAndCount(page);

    if (count === 0) {
      throw new NotFoundException('유저 목록이 없습니다.');
    }
    return [results.map((result: User) => new GetUserDto(result)), count];
  }

  async findOneUserByNickname(name: string): Promise<User> {
    /**
     * @param name - 유저 닉네임
     * @desc 유저에 대한 데이터 반환
     */

    if (typeof name === 'undefined') return undefined;

    const user = await this.userRepository.findOneUserBy(User.byNickname(name));

    if (!user) {
      throw new NotFoundException('유저 정보를 찾지 못했습니다');
    }

    return user;
  }

  async findOneAdminBy(props: AdminSignInProps): Promise<User> {
    /**
     * @param name - 유저 닉네임
     * @desc 유저에 대한 데이터 반환
     */

    const admin = await this.userRepository.findOneUserBy(User.adminOf(props));

    if (!admin) {
      throw new NotFoundException('관리자 정보를 찾지 못했습니다');
    }

    return admin;
  }
}
