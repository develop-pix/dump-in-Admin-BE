import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { BoothQueryDto } from '../dto/get-photo-booth-query.dto';
import { PaginatedProps } from '../../common/dto/paginated-req.dto';

export interface FindBoothOptionWhere {
  id?: string;
  name?: string;
  location?: string;
}

@Injectable()
export class PhotoBoothRepository {
  constructor(
    @InjectRepository(PhotoBooth)
    private readonly photoBoothRepository: Repository<PhotoBooth>,
  ) { }

  async findBoothByOptionAndCount(
    request: BoothQueryDto,
  ): Promise<[PhotoBooth[], number]> {
    const options = this.findBoothManyOptions(
      request.getPageProps(),
      PhotoBooth.of(request.getQueryProps()),
    );
    return await this.photoBoothRepository.findAndCount(options);
  }

  async findOneBoothById(id: string): Promise<PhotoBooth | null> {
    const where = this.findBoothOptionsWhere(PhotoBooth.byId({ id }));
    return await this.photoBoothRepository.findOneBy(where);
  }

  private findBoothManyOptions(
    page: PaginatedProps,
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
