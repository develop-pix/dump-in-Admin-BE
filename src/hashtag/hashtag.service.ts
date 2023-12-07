import { Injectable } from '@nestjs/common';
import { Hashtag } from './entity/hashtag.entity';
import { HashtagRepository } from './repository/hastag.repository';

@Injectable()
export class HashtagService {
  constructor(private readonly hashtagRepository: HashtagRepository) {}

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
}
