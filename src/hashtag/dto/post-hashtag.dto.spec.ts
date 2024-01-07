import { Hashtag } from '../entity/hashtag.entity';
import { CreateHashtags } from './post-hashtag.dto';

describe('CreateHashtags', () => {
  let createHashtags: CreateHashtags;

  beforeEach(() => {
    createHashtags = new CreateHashtags();
  });

  it('should be defined', () => {
    expect(createHashtags).toBeDefined();
  });

  describe('toCreateEntity', () => {
    it('SUCCESS: String 배열로 Hashtag 인스턴스 생성', () => {
      createHashtags.hashtags = ['행사', '웨딩', '파티', '스냅'];

      const result = createHashtags.toCreateEntity();

      expect(result).toEqual(Hashtag.unique(createHashtags.hashtags));
      expect(result).toHaveLength(4);
      expect(result[0]).toBeInstanceOf(Hashtag);
    });

    it('SUCCESS: 중복된 해시태그이름은 제외하고 한번만 Hashtag 인스턴스 생성', () => {
      createHashtags.hashtags = ['행사', '행사'];

      const result = createHashtags.toCreateEntity();

      expect(result).toEqual(Hashtag.unique(createHashtags.hashtags));
      expect(result).toHaveLength(1);
    });
  });
});
