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
import { RawCountByDate } from '../../dashboard/dto/get-statistics.dto';

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

  findUserByOptionAndCount(page: PaginationProps): Promise<[User[], number]> {
    const options = this.findUserManyOptions();
    const { take, skip } = page;
    return this.findAndCount({ take, skip, ...options });
  }

  findOneUser(user: User): Promise<User> {
    const options = this.findUserManyOptions(user);
    return this.findOneOrFail(options);
  }

  countUsersByDate(): Promise<RawCountByDate[]> {
    return this.createQueryBuilder('user')
      .select(['DATE(created_at) as created', 'COUNT(id) as user'])
      .where('deleted_at IS NULL')
      .groupBy('created')
      .orderBy('created', 'DESC')
      .getRawMany();
  }

  private findUserManyOptions(user?: User): FindManyOptions<User> {
    const where = this.findUserOptionsWhere(user);
    const relations = { reviews: true };
    const select: FindOptionsSelect<User> = {
      id: true,
      username: true,
      nickname: true,
      reviews: { id: true },
      email: true,
      createdAt: true,
      deletedAt: true,
    };
    return { where, relations, select };
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
