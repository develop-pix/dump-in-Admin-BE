import { Injectable, NotFoundException } from '@nestjs/common';
import { Hashtag } from './entity/hashtag.entity';
import { HashtagRepository } from './repository/hastag.repository';
import { BrandHashtagRepository } from './repository/brand-hashtag.repository';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { GetHashtagListDto } from './dto/get-hastag-list.dto';
import { EventHashtagRepository } from './repository/event-hashtag.repository';

@Injectable()
export class HashtagService {
  constructor(
    private readonly hashtagRepo: HashtagRepository,
    private readonly brandHashtagRepo: BrandHashtagRepository,
    private readonly eventHashtagRepo: EventHashtagRepository,
  ) {}

  /**
   * @desc - 전체 해시태그 목록 조회
   */
  async findAllHashtags(
    pageProps: PaginationProps,
  ): Promise<[GetHashtagListDto[], number]> {
    const [results, count] = await this.hashtagRepo.findAll(pageProps);

    if (count === 0) {
      throw new NotFoundException('해시태그를 찾지 못했습니다');
    }
    return [results.map((hashtag) => new GetHashtagListDto(hashtag)), count];
  }

  /**
   * @param hashtags - 해시태그 여러개를 가진 배열
   * @desc - 해시태그 배열 중 중복을 제거
   *       - 이미 존재하는 해시태그 찾기
   *       - 존재하지 않는 해시태그 필터링
   *       - 존재하지 않는 해시태그 생성
   *       - 이미 존재하는 해시태그와 새로 생성된 해시태그 합치기
   */
  async createHashtags(hashtags: string[]): Promise<Hashtag[]> {
    const uniqueHashtags = [...new Set(hashtags)];
    const existingHashtags = await this.findExistingHashtags(uniqueHashtags);
    const newHashtags = await this.createNonExistingHashtags(
      uniqueHashtags,
      existingHashtags,
    );

    return [...existingHashtags, ...newHashtags];
  }

  /**
   * @param hashtagNames - 해시태그 이름
   * @desc - 해시태그 이름들을 가지고 해시태그 테이블에 존재하는지 검색
   */
  private findExistingHashtags(hashtagNames: string[]): Promise<Hashtag[]> {
    return this.hashtagRepo.findManyHashtagByOption(
      hashtagNames.map((name) => Hashtag.byName(name)),
    );
  }

  /**
   * @param uniqueHashtags - 중복을 제거한 해시태그 이름들
   * @param existingHashtags  - 해시태그 테이블 안에 존재하는 해시태그
   * @desc - 존재하지 않는 해시태그 필터링
   *       - 존재하지 않는 해시태그 생성
   */
  private createNonExistingHashtags(
    uniqueHashtags: string[],
    existingHashtags: Hashtag[],
  ): Promise<Hashtag[]> {
    const existingHashtagNameSet = new Set(
      existingHashtags.map((tag) => tag.name),
    );
    const newHashtagNames = uniqueHashtags.filter(
      (tag) => !existingHashtagNameSet.has(tag),
    );

    return this.hashtagRepo.save(
      newHashtagNames.map((name) => Hashtag.create(name)),
    );
  }
}
