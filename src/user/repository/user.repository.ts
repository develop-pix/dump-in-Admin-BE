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
    const queryBuilder = await this.userRepository
      .createQueryBuilder('users')
      .select(['email', 'username', 'password', 'is_admin'])
      .where('username = :username', { username })
      .getRawOne();

    return new RawAdmin(queryBuilder);
  }
}
