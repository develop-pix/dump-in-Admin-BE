// common-hashtag.repository.ts
import { FindOptionsWhere, Repository } from 'typeorm';
import { BrandHashtag } from '../entity/photo-booth-hashtag.entity';
import { EventHashtag } from '../entity/event-hashtag.entity';

export class EntityToHashtagRepository extends Repository<
  BrandHashtag | EventHashtag
> {
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

  findOptionsWhere(
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
