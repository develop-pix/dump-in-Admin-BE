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
  async saveHashtags(tags: Hashtag[]): Promise<Hashtag[]> {
    return await this.save(tags);
  }

  async findAll(page: PaginationProps): Promise<[Hashtag[], number]> {
    const { take, skip } = page;
    return await this.findAndCount({ take, skip });
  }

  async findManyHashtagByOption(tags: Hashtag[]): Promise<Hashtag[]> {
    const where = this.findManyHashtagOptionsWhere(tags);
    return await this.find({ where });
  }

  private findManyHashtagOptionsWhere(
    tags: Hashtag[],
  ): FindOptionsWhere<Hashtag> {
    return { name: In(tags.map((tag) => tag.name)) };
  }
}
