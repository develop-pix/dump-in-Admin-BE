import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from '../entity/event.entity';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
  ) {}

  async saveEvent(event: Events): Promise<Events> {
    return await this.eventRepository.save(event);
  }

  async findEventByOptionAndCount(
    event: Events,
    page: PaginationProps,
  ): Promise<[Events[], number]> {
    const options = this.findEventManyOptions(event, page);
    return await this.eventRepository.findAndCount(options);
  }

  async findOneEvent(event: Events): Promise<Events> {
    const options = this.findEventManyOptions(event);
    return await this.eventRepository.findOne(options);
  }

  async updateEvent(id: number, event: Events): Promise<boolean> {
    const result = await this.eventRepository.update({ id }, event);
    return result.affected > 0;
  }

  async isExistEvent(event: Events): Promise<boolean> {
    const where = this.findEventOptionsWhere(event);
    return await this.eventRepository.exist({ where });
  }

  private findEventManyOptions(
    event: Events,
    page?: PaginationProps,
  ): FindManyOptions<Events> {
    const { take, skip } = page ?? {};
    const where = this.findEventOptionsWhere(event);
    const relations = {
      eventImages: true,
      photoBoothBrand: true,
      eventHashtag: true,
    };
    const select: FindOptionsSelect<Events> = {
      id: true,
      title: true,
      content: true,
      mainThumbnailUrl: true,
      startDate: true,
      endDate: true,
      viewCount: true,
      likeCount: true,
      isPublic: true,
    };
    return { where, relations, take, skip, select };
  }

  private findEventOptionsWhere(event: Events): FindOptionsWhere<Events> {
    return {
      id: event.id,
      title: event.title,
      photoBoothBrand: event.photoBoothBrand,
    };
  }
}
