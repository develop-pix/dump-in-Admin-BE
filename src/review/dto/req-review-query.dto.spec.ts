import { ReviewQueryParam } from './req-review-query.dto';

describe('ReviewQueryParam', () => {
  let reviewQueryParam: ReviewQueryParam;

  beforeEach(() => {
    reviewQueryParam = new ReviewQueryParam();
  });

  it('should be defined', () => {
    expect(reviewQueryParam).toBeDefined();
  });

  it('SUCCESS: 쿼리 속성 전달 확인', () => {
    const boothName = 'Example Brand';
    const nickname = 'Example Nickname';
    reviewQueryParam.boothName = boothName;
    reviewQueryParam.nickname = nickname;
    const result = reviewQueryParam.getQueryProps();
    expect(result).toEqual({
      boothName,
      nickname,
    });
  });
});
