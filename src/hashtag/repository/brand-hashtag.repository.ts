import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BrandHashtag } from '../entity/brand-hashtag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandHashtagRepository extends Repository<BrandHashtag> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(BrandHashtag);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findManyHashtags(entityToHashtag: BrandHashtag): Promise<BrandHashtag[]> {
    const options = this.findBrandHashtagManyOptions(entityToHashtag);
    return this.find(options);
  }

  private findBrandHashtagManyOptions(
    entityToHashtag: BrandHashtag,
  ): FindManyOptions<BrandHashtag> {
    const where = this.findBrandHashtagOptionsWhere(entityToHashtag);
    const relations = { photoBoothBrand: true };
    return { where, relations };
  }

  private findBrandHashtagOptionsWhere(
    tag: BrandHashtag,
  ): FindOptionsWhere<BrandHashtag> {
    return {
      photoBoothBrand: tag.photoBoothBrand,
    };
  }
}
