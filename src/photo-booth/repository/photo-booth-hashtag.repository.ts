import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag, PhotoBoothHashtag } from '../entity/photo-booth-brand.entity';

@Injectable()
export class PhotoBoothHashtagRepository {
  constructor(
    @InjectRepository(PhotoBoothHashtag)
    private readonly photoBoothHashtagRepository: Repository<PhotoBoothHashtag>,
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async saveHashtags(tags: Hashtag[]): Promise<Hashtag[]> {
    return await this.hashtagRepository.save(tags);
  }

  async findManyHashtagByOption(tags: Hashtag[]): Promise<Hashtag[]> {
    const where = this.findManyHashtagOptionsWhere(tags);
    return await this.hashtagRepository.findBy(where);
  }

  async findOneHashtagBy(tag: Hashtag): Promise<Hashtag> {
    const where = this.findHashtagOptionsWhere(tag);
    return await this.hashtagRepository.findOneBy(where);
  }

  private findHashtagOptionsWhere(tag: Hashtag): FindOptionsWhere<Hashtag> {
    return {
      id: tag.id,
      name: tag.name,
    };
  }

  private findManyHashtagOptionsWhere(
    tags: Hashtag[],
  ): FindOptionsWhere<Hashtag> {
    return { name: In(tags.map((tag) => tag.name)) };
  }

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
