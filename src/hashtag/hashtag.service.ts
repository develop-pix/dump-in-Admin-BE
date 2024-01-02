import { Injectable } from '@nestjs/common';
import { Hashtag } from './entity/hashtag.entity';
import { HashtagRepository } from './repository/hastag.repository';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';

@Injectable()
export class HashtagService {
  constructor(private readonly hashtagRepo: HashtagRepository) {}

  /**
   * @desc - 전체 해시태그 목록 조회
   */
  async findAllHashtags(
    pageProps: PaginationProps,
  ): Promise<[Hashtag[], number]> {
    return await this.hashtagRepo.findAll(pageProps);
  }

  /**
   * @param hashtags - 해시태그 여러개를 가진 배열
   * @desc - 해시태그 배열 중 중복을 제거
   *       - 이미 존재하는 해시태그 찾기
   *       - 존재하지 않는 해시태그 필터링
   *       - 존재하지 않는 해시태그 생성
   *       - 이미 존재하는 해시태그와 새로 생성된 해시태그 합치기
   */
  async createHashtags(uniqueHashtags: Hashtag[]): Promise<Hashtag[]> {
    const existingHashtags =
      await this.hashtagRepo.findManyHashtagByOption(uniqueHashtags);
    const newHashtags = await this.createNonExistingHashtags(
      uniqueHashtags,
      existingHashtags,
    );

    return [...existingHashtags, ...newHashtags];
  }

  /**
   * @param uniqueHashtags - 중복을 제거한 해시태그 이름들
   * @param existingHashtags  - 해시태그 테이블 안에 존재하는 해시태그
   * @desc - 존재하지 않는 해시태그 필터링
   *       - 존재하지 않는 해시태그 생성
   */
  private createNonExistingHashtags(
    uniqueHashtags: Hashtag[],
    existingHashtags: Hashtag[],
  ): Promise<Hashtag[]> {
    const existingHashtagNameSet = new Set(
      existingHashtags.map((tag) => tag.name),
    );
    const newHashtagNames = uniqueHashtags.filter(
      (tag) => !existingHashtagNameSet.has(tag.name),
    );

    return this.hashtagRepo.save(newHashtagNames);
  }
}
