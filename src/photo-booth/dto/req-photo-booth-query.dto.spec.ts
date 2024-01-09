import { BoothQueryParam } from './req-photo-booth-query.dto';

describe('BoothQueryParam', () => {
  let queryParam: BoothQueryParam;

  beforeEach(() => {
    queryParam = new BoothQueryParam();
  });

  it('should be defined', () => {
    expect(queryParam).toBeDefined();
  });

  describe('getQueryProps', () => {
    it('SUCCESS: 쿼리 속성 전달 확인', () => {
      const location = '서울';
      const name = '포토부스';
      const brandName = 'ABC Company';
      queryParam.location = location;
      queryParam.name = name;
      queryParam.brandName = brandName;

      expect(queryParam.getQueryProps()).toEqual({
        location,
        name,
        brandName,
      });
    });
  });
});
