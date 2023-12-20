import { Repository, FindOptionsWhere, In, DataSource } from 'typeorm';
import { Hashtag } from '../entity/hashtag.entity';
import { Injectable } from '@nestjs/common';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class HashtagRepository extends Repository<Hashtag> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(Hashtag);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findAll(page: PaginationProps): Promise<[Hashtag[], number]> {
    const { take, skip } = page;
    return this.findAndCount({ take, skip });
  }

  findManyHashtagByOption(tags: Hashtag[]): Promise<Hashtag[]> {
    const where = this.findManyHashtagOptionsWhere(tags);
    return this.find({ where });
  }

  private findManyHashtagOptionsWhere(
    tags: Hashtag[],
  ): FindOptionsWhere<Hashtag> {
    return { name: In(tags.map((tag) => tag.name)) };
  }
}
