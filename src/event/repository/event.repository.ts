import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Events } from '../entity/event.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class EventRepository extends Repository<Events> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(Events);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findEventByOptionAndCount(
    event: Events,
    page: PaginationProps,
  ): Promise<[Events[], number]> {
    const { skip, take } = page;
    const options = this.findEventManyOptions(event);
    return this.findAndCount({ skip, take, ...options });
  }

  findOneEvent(event: Events): Promise<Events> {
    const options = this.findEventManyOptions(event);
    return this.findOne(options);
  }

  private findEventManyOptions(event: Events): FindManyOptions<Events> {
    const where = this.findEventOptionsWhere(event);
    const relations = {
      eventImages: true,
      photoBoothBrand: true,
      eventHashtags: true,
    };
    const select: FindOptionsSelect<Events> = {
      id: true,
      title: true,
      content: true,
      mainThumbnailUrl: true,
      photoBoothBrand: { name: true },
      startDate: true,
      endDate: true,
      viewCount: true,
      likeCount: true,
      isPublic: true,
    };
    return { where, relations, select };
  }

  private findEventOptionsWhere(event: Events): FindOptionsWhere<Events> {
    return {
      id: event.id,
      title: event.title,
      photoBoothBrand: event.photoBoothBrand,
    };
  }
}
