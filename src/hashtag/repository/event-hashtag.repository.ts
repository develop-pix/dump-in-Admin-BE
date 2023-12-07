import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { EventHashtag } from '../entity/event-hashtag.entity';
import { EntityHashtagRepositoryInterface } from './hastag.repository';

export class EventHashtagRepository
  implements EntityHashtagRepositoryInterface<EventHashtag>
{
  constructor(
    @InjectRepository(EventHashtag)
    private readonly eventHashtagRepository: Repository<EventHashtag>,
  ) {}

  async saveHashtags(eventWithTags: EventHashtag[]): Promise<EventHashtag[]> {
    return await this.eventHashtagRepository.save(eventWithTags);
  }

  async findManyHashtags(eventHashtag: EventHashtag): Promise<EventHashtag[]> {
    const where = this.findOptionsWhere(eventHashtag);
    return await this.eventHashtagRepository.findBy(where);
  }

  async removeAllHashtags(eventHashtags: EventHashtag[]): Promise<boolean> {
    if (eventHashtags.length === 0) {
      return false;
    }
    const result = await this.eventHashtagRepository.remove(eventHashtags);
    return result.length > 0;
  }

  findOptionsWhere(tag: EventHashtag): FindOptionsWhere<EventHashtag> {
    return {
      event: tag.event,
    };
  }
}
