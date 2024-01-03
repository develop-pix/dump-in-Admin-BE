import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class PhotoBoothRepository extends Repository<PhotoBooth> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(PhotoBooth);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findBoothByOptionAndCount(
    booth: PhotoBooth,
    page: PaginationProps,
  ): Promise<[PhotoBooth[], number]> {
    const { take, skip } = page;
    const options = this.findBoothManyOptions(booth);
    return this.findAndCount({
      take,
      skip,
      ...options,
    });
  }

  findOneBooth(booth: PhotoBooth): Promise<PhotoBooth> {
    const options = this.findBoothManyOptions(booth);
    return this.findOneOrFail(options);
  }

  private findBoothManyOptions(booth: PhotoBooth): FindManyOptions<PhotoBooth> {
    const where = this.findBoothOptionsWhere(booth);
    const relations = { photoBoothBrand: true };
    const select: FindOptionsSelect<PhotoBooth> = {
      id: true,
      name: true,
      location: true,
      roadAddress: true,
      streetAddress: true,
      photoBoothBrand: {
        name: true,
      },
    };
    return { where, relations, select };
  }

  private findBoothOptionsWhere(
    booth: PhotoBooth,
  ): FindOptionsWhere<PhotoBooth> {
    return {
      id: booth.id,
      location: booth.location,
      name: booth.name,
      photoBoothBrand: booth.photoBoothBrand,
    };
  }
}
