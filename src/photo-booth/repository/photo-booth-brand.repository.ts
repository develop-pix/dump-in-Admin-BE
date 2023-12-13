import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class PhotoBoothBrandRepository {
  constructor(
    @InjectRepository(PhotoBoothBrand)
    private readonly photoBoothBrandRepository: Repository<PhotoBoothBrand>,
  ) {}

  async saveBrand(brand: PhotoBoothBrand): Promise<PhotoBoothBrand> {
    return await this.photoBoothBrandRepository.save(brand);
  }

  async findBrandByOptionAndCount(
    brand: PhotoBoothBrand,
    page: PaginationProps,
  ): Promise<[PhotoBoothBrand[], number]> {
    const options = this.findBrandManyOptions(brand, page);
    return await this.photoBoothBrandRepository.findAndCount(options);
  }

  async findOneBrand(brand: PhotoBoothBrand): Promise<PhotoBoothBrand> {
    const options = this.findBrandManyOptions(brand);
    return await this.photoBoothBrandRepository.findOne(options);
  }

  async updateBoothBrand(id: number, brand: PhotoBoothBrand): Promise<boolean> {
    const result = await this.photoBoothBrandRepository.update({ id }, brand);
    return result.affected > 0;
  }

  async isExistBrand(brand: PhotoBoothBrand): Promise<boolean> {
    const where = this.findBrandOptionsWhere(brand);
    return await this.photoBoothBrandRepository.exist({ where });
  }

  private findBrandManyOptions(
    brand: PhotoBoothBrand,
    page?: PaginationProps,
  ): FindManyOptions<PhotoBoothBrand> {
    const { take, skip } = page ?? {};
    const where = this.findBrandOptionsWhere(brand);
    const relations = { brandHashtags: true };
    const select: FindOptionsSelect<PhotoBoothBrand> = {
      id: true,
      name: true,
      mainThumbnailImageUrl: true,
      isEvent: true,
    };
    return { where, relations, take, skip, select };
  }

  private findBrandOptionsWhere(
    brand: PhotoBoothBrand,
  ): FindOptionsWhere<PhotoBoothBrand> {
    return {
      id: brand.id,
      name: brand.name,
      isEvent: brand.isEvent,
      brandHashtags: brand.brandHashtags?.map((hashtag) => ({
        hashtag: { name: hashtag.hashtag.name },
      })),
    };
  }
}
