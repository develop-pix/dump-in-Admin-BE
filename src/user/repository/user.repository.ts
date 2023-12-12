import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from '../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { PaginationProps } from 'src/common/dto/get-pagination-query.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(User);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

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
      createdAt: true,
      deletedAt: true,
    };
    return { relations, take, skip, select };
  }

  private findUserOptionsWhere(user: User): FindOptionsWhere<User> {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
    };
  }
}
