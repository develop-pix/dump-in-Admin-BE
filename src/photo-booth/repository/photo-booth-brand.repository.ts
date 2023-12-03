import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';
import { PaginationProps } from '../../common/dto/paginated-req.dto';

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
    const options = this.findBrandManyOptions(page, brand);
    return await this.photoBoothBrandRepository.findAndCount(options);
  }

  async findOneBrandBy(booth: PhotoBoothBrand): Promise<PhotoBoothBrand> {
    const where = this.findBrandOptionsWhere(booth);
    return await this.photoBoothBrandRepository.findOneBy(where);
  }

  async updateBoothBrand(id: number, booth: PhotoBoothBrand): Promise<boolean> {
    const result = await this.photoBoothBrandRepository.update({ id }, booth);
    return result.affected > 0;
  }

  private findBrandManyOptions(
    page: PaginationProps,
    brand: PhotoBoothBrand,
  ): FindManyOptions<PhotoBoothBrand> {
    const { take, skip } = page;
    const where = this.findBrandOptionsWhere(brand);
    const relations = { photo_booth_hashtags: true };
    const select: FindOptionsSelect<PhotoBoothBrand> = {
      id: true,
      name: true,
      main_thumbnail_image_url: true,
      is_event: true,
      photo_booth_hashtags: {
        id: false,
        hashtag: {
          id: true,
          name: true,
        },
      },
    };
    return { where, relations, take, skip, select };
  }

  private findBrandOptionsWhere(
    brand: PhotoBoothBrand,
  ): FindOptionsWhere<PhotoBoothBrand> {
    return {
      id: brand.id,
      name: brand.name,
      is_event: brand.is_event,
    };
  }
}
