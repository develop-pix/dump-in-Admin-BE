import { Injectable, NotFoundException } from '@nestjs/common';
import { Hashtag } from './entity/hashtag.entity';
import { HashtagRepository } from './repository/hastag.repository';
import { BrandHashtag } from './entity/brand-hashtag.entity';
import { PhotoBoothBrand } from '../photo-booth/entity/photo-booth-brand.entity';
import { BrandHashtagRepository } from './repository/brand-hashtag.repository';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { GetHashtagListDto } from './dto/get-hastag-list.dto';
import { EventHashtagRepository } from './repository/event-hashtag.repository';
import { Events } from '../event/entity/event.entity';
import { EventHashtag } from './entity/event-hashtag.entity';

@Injectable()
export class HashtagService {
  constructor(
    private readonly hashtagRepo: HashtagRepository,
    private readonly brandHashtagRepo: BrandHashtagRepository,
    private readonly eventHashtagRepo: EventHashtagRepository,
  ) {}

  async findAllHashtags(
    pageProps: PaginationProps,
  ): Promise<[GetHashtagListDto[], number]> {
    /**
     * @desc - 전체 해시태그 목록 조회
     */

    const [results, count] = await this.hashtagRepo.findAll(pageProps);

    if (count === 0) {
      throw new NotFoundException('해시태그를 찾지 못했습니다');
    }
    return [results.map((hashtag) => new GetHashtagListDto(hashtag)), count];
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

    const existingHashtags = await this.hashtagRepo.findManyHashtagByOption(
      uniqueHashtags.map((name) => Hashtag.byName(name)),
    );

    const existingHashtagNameSet = new Set(
      existingHashtags.map((tag) => tag.name),
    );

    const newHashtagNames = uniqueHashtags.filter(
      (tag) => !existingHashtagNameSet.has(tag),
    );

    const newHashtags =
      newHashtagNames.length > 0
        ? await this.hashtagRepo.save(
            newHashtagNames.map((name) => Hashtag.create(name)),
          )
        : [];

    return [...existingHashtags, ...newHashtags];
  }

  async handleEventHashtags(entity: Events): Promise<void> {
    /**
     * @param entity - 이벤트 엔티티
     * @desc - 연결된 모든 해시태그 가져오기
     *       - 엔티티와 관련된 해시태그 모두 삭제
     */

    const allHashtags = await this.eventHashtagRepo.findManyHashtags(
      EventHashtag.of(entity),
    );

    this.eventHashtagRepo.remove(allHashtags);
  }

  async handleBrandHashtags(entity: PhotoBoothBrand): Promise<void> {
    /**
     * @param entity - 브랜드 엔티티
     * @desc - 연결된 모든 해시태그 가져오기
     *       - 엔티티와 관련된 해시태그 모두 삭제
     *       - 새로운 해시태그 생성 및 연결
     */

    const allHashtags = await this.brandHashtagRepo.findManyHashtags(
      BrandHashtag.of(entity),
    );

    this.brandHashtagRepo.remove(allHashtags);
  }
}
