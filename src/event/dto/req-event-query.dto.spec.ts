import { EventQueryParam } from './req-event-query.dto';

describe('EventQueryParam', () => {
  let eventQueryParam: EventQueryParam;

  beforeEach(() => {
    eventQueryParam = new EventQueryParam();
  });

  it('should be defined', () => {
    expect(eventQueryParam).toBeDefined();
  });

  it('SUCCESS: 쿼리 속성 전달 확인', () => {
    const brandName = 'Example Brand';
    const title = 'Example Title';
    eventQueryParam.brandName = brandName;
    eventQueryParam.title = title;
    expect(eventQueryParam.getQueryProps()).toEqual({
      brandName,
      title,
    });
  });
});
