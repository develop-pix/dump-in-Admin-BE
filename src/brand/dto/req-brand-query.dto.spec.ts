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
      const name = 'Example Brand';
      const isExampleEvent = true;
      brandQueryParam.name = name;
      brandQueryParam.isEvent = isExampleEvent;

      const queryProps = brandQueryParam.getQueryProps();

      expect(queryProps).toEqual({
        name,
        isEvent: isExampleEvent,
      });
    });
  });
});
