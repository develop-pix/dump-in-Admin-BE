import { Injectable } from '@nestjs/common';
import { Hashtag } from './entity/hashtag.entity';
import {
  HashtagRepository,
  EntityHashtagRepositoryInterface,
} from './repository/hastag.repository';
import { Events } from '../event/entity/event.entity';
import { EventHashtag } from './entity/event-hashtag.entity';
import { BrandHashtag } from './entity/photo-booth-hashtag.entity';
import { PhotoBoothBrand } from '../photo-booth/entity/photo-booth-brand.entity';

@Injectable()
export class HashtagService {
  constructor(
    private readonly hashtagRepository: HashtagRepository,
    private readonly unifiedEntityHashtagRepository: EntityHashtagRepositoryInterface<
      BrandHashtag | EventHashtag
    >,
  ) {}

  create() {
    return 'This action adds a new hashtag';
  }

  findAll() {
    return `This action returns all hashtag`;
  }

  async createHashtags(hashtags: string[]): Promise<Hashtag[]> {
    /**
     * @param hashtags
     *       - 해시태그 여러개를 가진 배열
     * @desc - 해시태그 배열 중 중복을 제거
     *       - 이미 존재하는 해시태그 찾기
     *       - 존재하지 않는 해시태그 필터링
     *       - 존재하지 않는 해시태그 생성
     *       - 이미 존재하는 해시태그와 새로 생성된 해시태그 합치기
     */

    const uniqueHashtags = [...new Set(hashtags || [])];

    const existingHashtags =
      await this.hashtagRepository.findManyHashtagByOption(
        uniqueHashtags.map((name) => Hashtag.of({ name })),
      );

    const existingHashtagNameSet = new Set(
      existingHashtags.map((tag) => tag.name),
    );

    const newHashtagNames = uniqueHashtags.filter(
      (tag) => !existingHashtagNameSet.has(tag),
    );

    const newHashtags =
      newHashtagNames.length > 0
        ? await this.hashtagRepository.saveHashtags(
            newHashtagNames.map((name) => Hashtag.create({ name })),
          )
        : [];

    return [...existingHashtags, ...newHashtags];
  }

  async handleHashtags(
    entity: PhotoBoothBrand | Events,
    hashtags: string[],
  ): Promise<void> {
    /**
     * @param entity - 브랜드 또는 이벤트 엔티티
     * @desc - 연결된 모든 해시태그 가져오기
     *       - 엔티티와 관련된 해시태그 모두 삭제
     *       - 새로운 해시태그 생성 및 연결
     */

    const allHashtags =
      await this.unifiedEntityHashtagRepository.findManyHashtags(
        entity instanceof PhotoBoothBrand
          ? BrandHashtag.of(entity)
          : EventHashtag.of(entity),
      );

    await this.unifiedEntityHashtagRepository.removeAllHashtags(allHashtags);

    if (hashtags.length !== 0) {
      const newHashtags = await this.createHashtags(hashtags);
      await this.unifiedEntityHashtagRepository.saveHashtags(
        newHashtags.map((hashtag) =>
          entity instanceof PhotoBoothBrand
            ? BrandHashtag.create(entity, hashtag)
            : EventHashtag.create(entity, hashtag),
        ),
      );
    }
  }
}
