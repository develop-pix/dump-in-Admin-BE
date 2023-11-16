import { Repository } from 'typeorm';
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
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    return queryBuilder
      .select([
        'users.email as email',
        'users.username as username',
        'users.password as password',
        'users.is_admin as isAdmin',
      ])
      .where('users.username = :username', { username })
      .getRawOne();
  }
}
