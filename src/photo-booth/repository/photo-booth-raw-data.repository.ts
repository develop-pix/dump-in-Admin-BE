import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothRawData } from '../entity/raw-data.entity';
import { PaginatedProps } from '../../common/dto/paginated-req.dto';

@Injectable()
export class PhotoBoothRawRepository {
  constructor(
    @InjectRepository(PhotoBoothRawData)
    private readonly photoBoothRawRepository: Repository<PhotoBoothRawData>,
  ) {}

  async findHiddenBoothByOptionAndCount(
    booth: PhotoBoothRawData,
    page: PaginatedProps,
  ): Promise<[PhotoBoothRawData[], number]> {
    const options = this.findHiddenBoothManyOptions(page, booth);
    return await this.photoBoothRawRepository.findAndCount(options);
  }

  private findHiddenBoothManyOptions(
    page: PaginatedProps,
    booth: PhotoBoothRawData,
  ): FindManyOptions<PhotoBoothRawData> {
    const { take, skip } = page;
    const where = this.findHiddenBoothOptionsWhere(booth);
    const select: FindOptionsSelect<PhotoBoothRawData> = {
      id: true,
      name: true,
      location: true,
      latitude: true,
      longitude: true,
      operation_time: true,
      road_address: true,
      street_address: true,
    };
    return { where, take, skip, select };
  }

  private findHiddenBoothOptionsWhere(
    booth: PhotoBoothRawData,
  ): FindOptionsWhere<PhotoBoothRawData> {
    return {
      id: booth.id,
      location: booth.location,
      name: booth.name,
      preprocessed_at: IsNull(),
    };
  }
}
