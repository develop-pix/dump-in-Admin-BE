import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { PaginationProps } from '../../common/dto/paginated-req.dto';

@Injectable()
export class PhotoBoothRepository {
  constructor(
    @InjectRepository(PhotoBooth)
    private readonly photoBoothRepository: Repository<PhotoBooth>,
  ) {}

  async findBoothByOptionAndCount(
    booth: PhotoBooth,
    page: PaginationProps,
  ): Promise<[PhotoBooth[], number]> {
    const options = this.findBoothManyOptions(page, booth);
    return await this.photoBoothRepository.findAndCount(options);
  }

  async findOneBoothBy(booth: PhotoBooth): Promise<PhotoBooth> {
    const where = this.findBoothOptionsWhere(booth);
    return await this.photoBoothRepository.findOneBy(where);
  }

  async updatePhotoBooth(id: string, booth: PhotoBooth): Promise<boolean> {
    const result = await this.photoBoothRepository.update({ id }, booth);
    return result.affected > 0;
  }

  private findBoothManyOptions(
    page: PaginationProps,
    booth: PhotoBooth,
  ): FindManyOptions<PhotoBooth> {
    const { take, skip } = page;
    const where = this.findBoothOptionsWhere(booth);
    const relations = { photo_booth_brand: true };
    const select: FindOptionsSelect<PhotoBooth> = {
      id: true,
      name: true,
      location: true,
      latitude: true,
      longitude: true,
      operation_time: true,
      road_address: true,
      street_address: true,
      photo_booth_brand: {
        name: true,
      },
    };
    return { where, relations, take, skip, select };
  }

  private findBoothOptionsWhere(
    booth: PhotoBooth,
  ): FindOptionsWhere<PhotoBooth> {
    return {
      id: booth.id,
      location: booth.location,
      name: booth.name,
    };
  }
}
