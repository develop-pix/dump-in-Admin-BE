import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RawAdmin } from '../dto/get-session-admin.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<RawAdmin> {
    const result = await this.createUserQueryBuilder(username);
    return result.getRawOne();
  }

  async createUserQueryBuilder(
    username: string,
  ): Promise<SelectQueryBuilder<User>> {
    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    return queryBuilder
      .select([
        'user.email as email',
        'user.username as username',
        'user.password as password',
        'user.group as group',
      ])
      .where('username = :username', { username });
  }
}
