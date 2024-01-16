import { plainToInstance } from 'class-transformer';
import { Events } from '../entity/event.entity';
import { GetEventList } from './get-event-list.dto';
import { EventReqBody } from './req-event-body.dto';
import { EventHashtag } from '../../hashtag/entity/event-hashtag.entity';
import { GetEventDetail } from './get-event-detail.dto';

describe('GetEventList', () => {
  let eventReqBody: EventReqBody;
  let mockEventsData: Events;

  beforeEach(() => {
    eventReqBody = new EventReqBody();
    eventReqBody.title = 'Test Title';
    eventReqBody.content = 'Test Content';
    eventReqBody.mainThumbnailUrl = 'test-url';
    eventReqBody.brandName = 'Test Brand';
    eventReqBody.startDate = new Date('2024-01-01');
    eventReqBody.endDate = new Date('2024-01-02');
    eventReqBody.hashtags = [
      '캐릭터',
      '콜라보',
      '연예인',
      '스냅',
      '이달의프레임',
    ];
    eventReqBody.images = ['url', 'url2', 'url3', 'url4'];
    const eventToEntity = eventReqBody.toEntity();
    mockEventsData = plainToInstance(Events, {
      id: 1,
      photoBoothBrand: eventToEntity.brandName,
      eventHashtags: eventToEntity.hashtags.map((hashtag) =>
        EventHashtag.create(hashtag),
      ),
      eventImages: eventToEntity.images,
      ...eventToEntity,
    });
  });

  it('should be defined', () => {
    expect(eventReqBody).toBeDefined();
    expect(mockEventsData).toBeInstanceOf(Events);
  });

  describe('GetEventList', () => {
    it('SUCCESS: Events 엔티티로 GetEventList DTO 생성', () => {
      const getEventList: GetEventList = new GetEventList(mockEventsData);

      expect(getEventList.id).toEqual(mockEventsData.id);
      expect(getEventList.title).toEqual(mockEventsData.title);
      expect(getEventList.content).toEqual(mockEventsData.content);
      expect(getEventList.mainThumbnailUrl).toEqual(
        mockEventsData.mainThumbnailUrl,
      );
      expect(getEventList.brandName).toEqual(
        mockEventsData.photoBoothBrand.name,
      );
      expect(getEventList.hashtags).toEqual(
        mockEventsData.eventHashtags.map((hashtags) => hashtags.hashtag.name),
      );
      expect(getEventList.startDate).toEqual(mockEventsData.startDate);
      expect(getEventList.endDate).toEqual(mockEventsData.endDate);
    });
  });

  describe('GetEventDetail', () => {
    it('SUCCESS: Events 엔티티로 GetEventDetail DTO 생성', () => {
      const getEventDetail = new GetEventDetail(mockEventsData);

      expect(getEventDetail.id).toEqual(mockEventsData.id);
      expect(getEventDetail.images).toEqual(
        mockEventsData.eventImages.map((images) => images.eventImageUrl),
      );
    });
  });
});
