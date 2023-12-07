import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In } from 'typeorm';
import { Hashtag } from '../entity/hashtag.entity';

export interface EntityHashtagRepositoryInterface<T> {
  saveHashtags(tags: T[]): Promise<T[]>;
  findManyHashtags(entity: T): Promise<T[]>;
  removeAllHashtags(entities: T[]): Promise<boolean>;
  findOptionsWhere(tag: T): FindOptionsWhere<T>;
}

export class HashtagRepository {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}
  async saveHashtags(tags: Hashtag[]): Promise<Hashtag[]> {
    return await this.hashtagRepository.save(tags);
  }

  async findManyHashtagByOption(tags: Hashtag[]): Promise<Hashtag[]> {
    const where = this.findManyHashtagOptionsWhere(tags);
    return await this.hashtagRepository.findBy(where);
  }

  async findOneHashtagBy(tag: Hashtag): Promise<Hashtag> {
    const where = this.findHashtagOptionsWhere(tag);
    return await this.hashtagRepository.findOneBy(where);
  }

  private findHashtagOptionsWhere(tag: Hashtag): FindOptionsWhere<Hashtag> {
    return {
      id: tag.id,
      name: tag.name,
    };
  }

  private findManyHashtagOptionsWhere(
    tags: Hashtag[],
  ): FindOptionsWhere<Hashtag> {
    return { name: In(tags.map((tag) => tag.name)) };
  }
}
