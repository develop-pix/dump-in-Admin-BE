
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async validateAdminUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user.authGroupPermissions.userGroupId !== 2) {
      throw new UnauthorizedException('관리자 권한이 없습니다')
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
}