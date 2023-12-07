import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothHashtag } from '../entity/photo-booth-brand.entity';

@Injectable()
export class PhotoBoothHashtagRepository {
  constructor(
    @InjectRepository(PhotoBoothHashtag)
    private readonly photoBoothHashtagRepository: Repository<PhotoBoothHashtag>,
  ) {}

  async saveBrandHashtags(
    brandWithTags: PhotoBoothHashtag[],
  ): Promise<PhotoBoothHashtag[]> {
    return await this.photoBoothHashtagRepository.save(brandWithTags);
  }

  async findManyHashtagsOfBrand(
    photoBoothHashtag: PhotoBoothHashtag,
  ): Promise<PhotoBoothHashtag[]> {
    const where = this.findBrandHashtagOptionsWhere(photoBoothHashtag);
    return await this.photoBoothHashtagRepository.findBy(where);
  }

  async removeAllHashtagsOfBrand(
    photoBoothHashtags: PhotoBoothHashtag[],
  ): Promise<boolean> {
    if (photoBoothHashtags.length === 0) {
      return false;
    }
    const result =
      await this.photoBoothHashtagRepository.remove(photoBoothHashtags);
    return result.length > 0;
  }

  private findBrandHashtagOptionsWhere(
    tag: PhotoBoothHashtag,
  ): FindOptionsWhere<PhotoBoothHashtag> {
    return {
      photo_booth_brand: tag.photo_booth_brand,
    };
  }
}
