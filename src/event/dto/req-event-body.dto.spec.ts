import { PhotoBoothBrand } from '../../brand/entity/brand.entity';
import { EventReqBody } from './req-event-body.dto';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { EventImage } from '../entity/event-image.entity';

describe('EventReqBody', () => {
  let eventReqBody: EventReqBody;

  beforeEach(() => {
    eventReqBody = new EventReqBody();
    eventReqBody.title = 'Test Title';
    eventReqBody.content = 'Test Content';
    eventReqBody.mainThumbnailUrl = 'test-url';
    eventReqBody.brandName = 'Test Brand';
    eventReqBody.isPublic = true;
    eventReqBody.startDate = new Date('2024-01-01');
    eventReqBody.endDate = new Date('2024-01-10');
    eventReqBody.hashtags = [
      '캐릭터',
      '콜라보',
      '연예인',
      '스냅',
      '이달의프레임',
    ];
    eventReqBody.images = ['url', 'url2', 'url3', 'url4'];
  });

  it('should be defined', () => {
    expect(eventReqBody).toBeDefined();
  });

  it('SUCCESS: toEntity() 속성 확인', () => {
    const entity = eventReqBody.toEntity();

    expect(entity.title).toEqual(eventReqBody.title);
    expect(entity.content).toEqual(eventReqBody.content);
    expect(entity.mainThumbnailUrl).toEqual(eventReqBody.mainThumbnailUrl);
    expect(entity.brandName).toEqual(
      PhotoBoothBrand.byName(eventReqBody.brandName),
    );
    expect(entity.isPublic).toEqual(eventReqBody.isPublic);
    expect(entity.startDate).toEqual(eventReqBody.startDate);
    expect(entity.endDate).toEqual(eventReqBody.endDate);
    expect(entity.hashtags).toEqual(Hashtag.unique(eventReqBody.hashtags));
    expect(entity.eventImages).toHaveLength(4);
    expect(entity.eventImages[0]).toBeInstanceOf(EventImage);
  });
});
