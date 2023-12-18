import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { EventHashtag } from '../entity/event-hashtag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventHashtagRepository extends Repository<EventHashtag> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(EventHashtag);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  findManyHashtags(entityToHashtag: EventHashtag): Promise<EventHashtag[]> {
    const options = this.findEventHashtagManyOptions(entityToHashtag);
    return this.find(options);
  }

  private findEventHashtagManyOptions(
    entityToHashtag: EventHashtag,
  ): FindManyOptions<EventHashtag> {
    const where = this.findEventHashtagOptionsWhere(entityToHashtag);
    const relations = { event: true };
    return { where, relations };
  }

  private findEventHashtagOptionsWhere(
    tag: EventHashtag,
  ): FindOptionsWhere<EventHashtag> {
    return {
      event: tag.event,
    };
  }
}
