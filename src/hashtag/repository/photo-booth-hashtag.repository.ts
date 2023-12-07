import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandHashtag } from '../entity/photo-booth-hashtag.entity';
import { EntityHashtagRepositoryInterface } from './hastag.repository';

@Injectable()
export class BrandHashtagRepository
  implements EntityHashtagRepositoryInterface<BrandHashtag>
{
  constructor(
    @InjectRepository(BrandHashtag)
    private readonly photoBoothHashtagRepository: Repository<BrandHashtag>,
  ) {}

  async saveHashtags(brandWithTags: BrandHashtag[]): Promise<BrandHashtag[]> {
    return await this.photoBoothHashtagRepository.save(brandWithTags);
  }

  async findManyHashtags(
    photoBoothHashtag: BrandHashtag,
  ): Promise<BrandHashtag[]> {
    const where = this.findOptionsWhere(photoBoothHashtag);
    return await this.photoBoothHashtagRepository.findBy(where);
  }

  async removeAllHashtags(
    photoBoothHashtags: BrandHashtag[],
  ): Promise<boolean> {
    if (photoBoothHashtags.length === 0) {
      return false;
    }
    const result =
      await this.photoBoothHashtagRepository.remove(photoBoothHashtags);
    return result.length > 0;
  }

  findOptionsWhere(tag: BrandHashtag): FindOptionsWhere<BrandHashtag> {
    return {
      photo_booth_brand: tag.photo_booth_brand,
    };
  }
}
