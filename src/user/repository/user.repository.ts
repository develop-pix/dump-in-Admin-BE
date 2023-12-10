import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/dto/pagination-req.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  async findUserByOptionAndCount(
    page: PaginationProps,
  ): Promise<[User[], number]> {
    const options = this.findUserManyOptions(page);
    return await this.findAndCount(options);
  }

  async findOneUserBy(user: User): Promise<User> {
    const where = this.findUserOptionsWhere(user);
    return await this.findOneBy(where);
  }

  private findUserManyOptions(page: PaginationProps): FindManyOptions<User> {
    const { take, skip } = page;
    const relations = { reviews: true };
    const select: FindOptionsSelect<User> = {
      id: true,
      username: true,
      nickname: true,
      email: true,
      created_at: true,
      deleted_at: true,
    };
    return { relations, take, skip, select };
  }

  private findUserOptionsWhere(user: User): FindOptionsWhere<User> {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      is_admin: user.is_admin,
    };
  }
}
