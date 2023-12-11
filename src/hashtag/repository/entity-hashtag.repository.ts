import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
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
    hashtags: (BrandHashtag | EventHashtag)[],
  ): Promise<(BrandHashtag | EventHashtag)[]> {
    return await this.save(hashtags);
  }

  async findManyHashtags(
    commonHashtagOptions: BrandHashtag | EventHashtag,
  ): Promise<(BrandHashtag | EventHashtag)[]> {
    const where = this.findOptionsWhere(commonHashtagOptions);
    return await this.findBy(where);
  }

  async removeAllHashtags(
    hashtags: (BrandHashtag | EventHashtag)[],
  ): Promise<boolean> {
    if (hashtags.length === 0) {
      return false;
    }
    const result = await this.remove(hashtags);
    return result.length > 0;
  }

  private findOptionsWhere(
    tag: BrandHashtag | EventHashtag,
  ): FindOptionsWhere<BrandHashtag | EventHashtag> {
    if (tag instanceof EventHashtag) {
      return {
        event: tag.event,
      };
    }
    if (tag instanceof BrandHashtag) {
      return {
        photo_booth_brand: tag.photo_booth_brand,
      };
    }
  }
}
