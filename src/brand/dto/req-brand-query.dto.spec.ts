import { BrandQueryParam } from './req-brand-query.dto';

describe('BrandQueryParam', () => {
  let brandQueryParam: BrandQueryParam;

  beforeEach(() => {
    brandQueryParam = new BrandQueryParam();
  });

  it('should be defined', () => {
    expect(brandQueryParam).toBeDefined();
  });

  describe('getQueryProps()', () => {
    it('SUCCESS: 쿼리 속성 전달 확인', () => {
      brandQueryParam.name = '포토그레이';
      brandQueryParam.isEvent = true;

      const queryProps = brandQueryParam.getQueryProps();

      expect(queryProps).toEqual({
        name: '포토그레이',
        isEvent: true,
      });
    });
  });
});
