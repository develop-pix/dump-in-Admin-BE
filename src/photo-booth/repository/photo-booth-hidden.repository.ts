import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  IsNull,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { HiddenPhotoBooth } from '../entity/photo-booth-hidden.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class HiddenBoothRepository extends Repository<HiddenPhotoBooth> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(HiddenPhotoBooth);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findHiddenBoothByOptionAndCount(
    booth: HiddenPhotoBooth,
    page: PaginationProps,
  ): Promise<[HiddenPhotoBooth[], number]> {
    const { take, skip } = page;
    const options = this.findHiddenBoothManyOptions(booth);
    return this.findAndCount({ take, skip, ...options });
  }

  findOneHiddenBooth(booth: HiddenPhotoBooth): Promise<HiddenPhotoBooth> {
    const options = this.findHiddenBoothManyOptions(booth);
    return this.findOne(options);
  }

  private findHiddenBoothManyOptions(
    booth: HiddenPhotoBooth,
  ): FindManyOptions<HiddenPhotoBooth> {
    const where = this.findHiddenBoothOptionsWhere(booth);
    const select: FindOptionsSelect<HiddenPhotoBooth> = {
      id: true,
      name: true,
      location: true,
      roadAddress: true,
      streetAddress: true,
    };
    return { where, select };
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
