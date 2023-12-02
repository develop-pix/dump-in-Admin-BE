import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HiddenPhotoBooth } from '../entity/raw-data.entity';
import { PaginationProps } from '../../common/dto/paginated-req.dto';

@Injectable()
export class HiddenBoothRepository {
  constructor(
    @InjectRepository(HiddenPhotoBooth)
    private readonly hiddenBoothRepository: Repository<HiddenPhotoBooth>,
  ) {}

  async findHiddenBoothByOptionAndCount(
    booth: HiddenPhotoBooth,
    page: PaginationProps,
  ): Promise<[HiddenPhotoBooth[], number]> {
    const options = this.findHiddenBoothManyOptions(page, booth);
    return await this.hiddenBoothRepository.findAndCount(options);
  }

  async findOneHiddenBoothBy(
    booth: HiddenPhotoBooth,
  ): Promise<HiddenPhotoBooth> {
    const where = this.findHiddenBoothOptionsWhere(booth);
    return await this.hiddenBoothRepository.findOneBy(where);
  }

  async updateHiddenBooth(
    id: string,
    booth: HiddenPhotoBooth,
  ): Promise<boolean> {
    const result = await this.hiddenBoothRepository.update({ id }, booth);
    return result.affected > 0;
  }

  private findHiddenBoothManyOptions(
    page: PaginationProps,
    booth: HiddenPhotoBooth,
  ): FindManyOptions<HiddenPhotoBooth> {
    const { take, skip } = page;
    const where = this.findHiddenBoothOptionsWhere(booth);
    const select: FindOptionsSelect<HiddenPhotoBooth> = {
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
    booth: HiddenPhotoBooth,
  ): FindOptionsWhere<HiddenPhotoBooth> {
    return {
      id: booth.id,
      location: booth.location,
      name: booth.name,
      preprocessed_at: IsNull(),
    };
  }
}
