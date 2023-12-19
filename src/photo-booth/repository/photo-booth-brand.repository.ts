import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class PhotoBoothBrandRepository extends Repository<PhotoBoothBrand> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(PhotoBoothBrand);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findBrandByOptionAndCount(
    brand: PhotoBoothBrand,
    page: PaginationProps,
  ): Promise<[PhotoBoothBrand[], number]> {
    const { take, skip } = page;
    const options = this.findBrandManyOptions(brand);
    return this.findAndCount({
      take,
      skip,
      ...options,
    });
  }

  findOneBrand(brand: PhotoBoothBrand): Promise<PhotoBoothBrand> {
    const options = this.findBrandManyOptions(brand);
    return this.findOne(options);
  }

  private findBrandManyOptions(
    brand: PhotoBoothBrand,
  ): FindManyOptions<PhotoBoothBrand> {
    const where = this.findBrandOptionsWhere(brand);
    const relations = { brandHashtags: true };
    const select: FindOptionsSelect<PhotoBoothBrand> = {
      id: true,
      name: true,
      mainThumbnailImageUrl: true,
      isEvent: true,
    };
    return { where, relations, select };
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
