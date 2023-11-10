import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  // async getAuthGroupIdByUsername(username: string): Promise<string> {
  //   const user = await this.userRepository.findOne({ where: { username } });
  //   return user.authGroup.name;
  // }
}
