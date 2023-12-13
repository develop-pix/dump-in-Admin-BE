import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

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
    const options = this.findBoothManyOptions(booth, page);
    return await this.photoBoothRepository.findAndCount(options);
  }

  async findOneBooth(booth: PhotoBooth): Promise<PhotoBooth> {
    const options = this.findBoothManyOptions(booth);
    return await this.photoBoothRepository.findOne(options);
  }

  async saveOpenBooth(booth: PhotoBooth): Promise<PhotoBooth> {
    return await this.photoBoothRepository.save(booth);
  }

  async updatePhotoBooth(id: string, booth: PhotoBooth): Promise<boolean> {
    const result = await this.photoBoothRepository.update({ id }, booth);
    return result.affected > 0;
  }

  async deletePhotoBooth(id: string): Promise<boolean> {
    const result = await this.photoBoothRepository.delete({ id });
    return result.affected > 0;
  }

  async photoBoothHasId(booth: PhotoBooth): Promise<boolean> {
    return this.photoBoothRepository.hasId(booth);
  }

  private findBoothManyOptions(
    booth: PhotoBooth,
    page?: PaginationProps,
  ): FindManyOptions<PhotoBooth> {
    const { take, skip } = page ?? {};
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
    return { where, relations, take, skip, select };
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
