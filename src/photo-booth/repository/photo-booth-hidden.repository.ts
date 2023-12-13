import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HiddenPhotoBooth } from '../entity/photo-booth-hidden.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

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
    const options = this.findHiddenBoothManyOptions(booth, page);
    return await this.hiddenBoothRepository.findAndCount(options);
  }

  async findOneHiddenBooth(booth: HiddenPhotoBooth): Promise<HiddenPhotoBooth> {
    const options = this.findHiddenBoothManyOptions(booth);
    return await this.hiddenBoothRepository.findOne(options);
  }

  async updateHiddenBooth(
    id: string,
    booth: HiddenPhotoBooth,
  ): Promise<boolean> {
    const result = await this.hiddenBoothRepository.update({ id }, booth);
    return result.affected > 0;
  }

  private findHiddenBoothManyOptions(
    booth: HiddenPhotoBooth,
    page?: PaginationProps,
  ): FindManyOptions<HiddenPhotoBooth> {
    const { take, skip } = page ?? {};
    const where = this.findHiddenBoothOptionsWhere(booth);
    const select: FindOptionsSelect<HiddenPhotoBooth> = {
      id: true,
      name: true,
      location: true,
      roadAddress: true,
      streetAddress: true,
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
      preprocessedAt: IsNull(),
    };
  }
}
