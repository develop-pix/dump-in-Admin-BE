import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventHashtag, Events } from '../entity/event.entity';
import { PaginationProps } from '../../common/dto/paginated-req.dto';

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
    @InjectRepository(EventHashtag)
    private readonly eventHashtagRepository: Repository<EventHashtag>,
  ) {}

  async saveEvent(event: Events): Promise<Events> {
    return await this.eventRepository.save(event);
  }

  async findEventByOptionAndCount(
    event: Events,
    page: PaginationProps,
  ): Promise<[Events[], number]> {
    const options = this.findEventManyOptions(page, event);
    return await this.eventRepository.findAndCount(options);
  }

  async findOneEventBy(event: Events): Promise<Events> {
    const where = this.findEventOptionsWhere(event);
    return await this.eventRepository.findOneBy(where);
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
    page: PaginationProps,
    event: Events,
  ): FindManyOptions<Events> {
    const { take, skip } = page;
    const where = this.findEventOptionsWhere(event);
    const relations = {
      event_images: true,
      photo_booth_brand: true,
      event_hashtag: true,
    };
    const select: FindOptionsSelect<Events> = {
      id: true,
      title: true,
      content: true,
    };
    return { where, relations, take, skip, select };
  }

  private findEventOptionsWhere(event: Events): FindOptionsWhere<Events> {
    return {
      id: event.id,
      title: event.title,
      photo_booth_brand: event.photo_booth_brand,
    };
  }

  async saveEventHashtags(
    eventWithTags: EventHashtag[],
  ): Promise<EventHashtag[]> {
    return await this.eventHashtagRepository.save(eventWithTags);
  }

  async findManyHashtagsOfEvent(
    eventHashtag: EventHashtag,
  ): Promise<EventHashtag[]> {
    const where = this.findEventHashtagOptionsWhere(eventHashtag);
    return await this.eventHashtagRepository.findBy(where);
  }

  async removeAllHashtagsOfEvent(
    eventHashtags: EventHashtag[],
  ): Promise<boolean> {
    if (eventHashtags.length === 0) {
      return false;
    }
    const result = await this.eventHashtagRepository.remove(eventHashtags);
    return result.length > 0;
  }

  private findEventHashtagOptionsWhere(
    tag: EventHashtag,
  ): FindOptionsWhere<EventHashtag> {
    return {
      event: tag.event,
    };
  }
}