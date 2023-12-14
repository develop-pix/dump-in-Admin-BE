import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BrandHashtag } from '../entity/brand-hashtag.entity';
import { EventHashtag } from '../entity/event-hashtag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityToHashtagRepository extends Repository<
  BrandHashtag | EventHashtag
> {
  constructor(private readonly dataSource: DataSource) {
    const brandhashtagRepository = dataSource.getRepository(BrandHashtag);
    const eventhashtagRepository = dataSource.getRepository(EventHashtag);
    const baseRepository = brandhashtagRepository || eventhashtagRepository;
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  async saveHashtags(
    entityToHashtag: (BrandHashtag | EventHashtag)[],
  ): Promise<(BrandHashtag | EventHashtag)[]> {
    return await this.save(entityToHashtag);
  }

  async findManyHashtags(
    entityToHashtag: BrandHashtag | EventHashtag,
  ): Promise<(BrandHashtag | EventHashtag)[]> {
    const options = this.findEntityToHashtagManyOptions(entityToHashtag);
    return await this.find(options);
  }

  async removeAllHashtags(
    entityToHashtag: (BrandHashtag | EventHashtag)[],
  ): Promise<boolean> {
    const result = await this.remove(entityToHashtag);
    return result.length > 0;
  }

  private findEntityToHashtagManyOptions(
    entityToHashtag: BrandHashtag | EventHashtag,
  ): FindManyOptions<BrandHashtag | EventHashtag> {
    const where =
      entityToHashtag instanceof BrandHashtag
        ? this.findBrandHashtagOptionsWhere(entityToHashtag)
        : this.findEventHashtagOptionsWhere(entityToHashtag);
    const relations =
      entityToHashtag instanceof BrandHashtag
        ? { photoBoothBrand: true }
        : { event: true };
    return { where, relations };
  }

  private findBrandHashtagOptionsWhere(
    tag: BrandHashtag,
  ): FindOptionsWhere<BrandHashtag> {
    return {
      photoBoothBrand: tag.photoBoothBrand,
    };
  }

  private findEventHashtagOptionsWhere(
    tag: EventHashtag,
  ): FindOptionsWhere<EventHashtag> {
    return {
      event: tag.event,
    };
  }
}
