import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { EventRepository } from './repository/event.repository';
import { Events } from './entity/event.entity';
import { NotFoundException } from '@nestjs/common';
import { PhotoBoothBrand } from '../brand/entity/brand.entity';
import { Hashtag } from '../hashtag/entity/hashtag.entity';
import { BrandService } from '../brand/brand.service';
import { EventImage } from './entity/event-image.entity';
import { EventHashtag } from '../hashtag/entity/event-hashtag.entity';

class MockEventRepository {
  save = jest.fn();
  findEventByOptionAndCount = jest.fn();
  findOneEvent = jest.fn();
}

class MockHashtagService {
  createHashtags = jest.fn();
  eventHashtags = jest.fn();
}

class MockBrandService {
  findOneBrandBy = jest.fn();
}

describe('EventService', () => {
  let eventService: EventService;
  let hashtagService: HashtagService;
  let eventRepository: EventRepository;
  let brandService: BrandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: HashtagService, useClass: MockHashtagService },
        { provide: EventRepository, useClass: MockEventRepository },
        { provide: BrandService, useClass: MockBrandService },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    hashtagService = module.get<HashtagService>(HashtagService);
    eventRepository = module.get<EventRepository>(EventRepository);
    brandService = module.get<BrandService>(BrandService);

    jest.spyOn(eventRepository, 'save').mockImplementation((event: Events) => {
      const saveEvent = new Events();
      if (event.title === '없는 제목') {
        return Promise.resolve(saveEvent);
      } else if (event.id === 1) {
        return Promise.resolve(saveEvent);
      } else {
        return Promise.resolve(null);
      }
    });

    jest
      .spyOn(eventRepository, 'findEventByOptionAndCount')
      .mockImplementation((event: Events) => {
        const saveEvent = new Events();
        saveEvent.id = 1;
        saveEvent.title = '이벤트 제목';
        saveEvent.content = '이벤트 내용';

        if (event.title === '이벤트 제목') {
          return Promise.resolve([[saveEvent], 1]);
        } else if (event.photoBoothBrand?.name === '업체명') {
          return Promise.resolve([[saveEvent], 1]);
        } else {
          return Promise.resolve([[saveEvent], 0]);
        }
      });

    jest
      .spyOn(eventRepository, 'findOneEvent')
      .mockImplementation((event: Events) => {
        if (event.id === 1) {
          const saveEvent = new Events();
          saveEvent.id = 1;
          saveEvent.title = '이벤트 제목';
          saveEvent.content = '이벤트 내용';
          return Promise.resolve(saveEvent);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });

    jest
      .spyOn(hashtagService, 'createHashtags')
      .mockImplementation((hashtags: Hashtag[]) => {
        return Promise.resolve(hashtags);
      });

    jest
      .spyOn(hashtagService, 'eventHashtags')
      .mockImplementation((hashtags: Hashtag[]) => {
        return Promise.resolve(
          hashtags.map((hashtag) => EventHashtag.create(hashtag)),
        );
      });

    jest
      .spyOn(brandService, 'findOneBrandBy')
      .mockImplementation((brand: PhotoBoothBrand) => {
        if (brand.name === '업체명') {
          return Promise.resolve(brand);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    expect(hashtagService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(brandService).toBeDefined();
  });

  describe('findEventByQueryParam()', () => {
    const pageProps = {
      take: 10,
      skip: 1,
      page: 1,
    };

    it('SUCCESS: 이벤트 제목으로 쿼리하면 관련 데이터 여러개 반환', async () => {
      // Given
      const queryProps = {
        title: '이벤트 제목',
        brandName: undefined,
      };

      const [eventInDb, countInDb] =
        await eventRepository.findEventByOptionAndCount(
          Events.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await eventService.findEventByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(eventInDb);
      expect(resultCount).toEqual(countInDb);
    });

    it('SUCCESS: 포토부스 업체명으로 쿼리하면 관련 이벤트 데이터 여러개 반환', async () => {
      // Given
      const queryProps = {
        title: undefined,
        brandName: '업체명',
      };

      const [eventInDb, countInDb] =
        await eventRepository.findEventByOptionAndCount(
          Events.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await eventService.findEventByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(eventInDb);
      expect(resultCount).toEqual(countInDb);
    });

    it('SUCCESS: 쿼리 조건을 넣지 않으면 이벤트 데이터 전체 반환', async () => {
      // Given
      const queryProps = {
        title: undefined,
        brandName: undefined,
      };

      const [eventInDb, countInDb] =
        await eventRepository.findEventByOptionAndCount(
          Events.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await eventService.findEventByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(eventInDb);
      expect(resultCount).toEqual(countInDb);
    });
  });

  describe('findOneEventById()', () => {
    it('SUCCESS: id 값이 존재할 때 데이터 반환', async () => {
      // Given
      const id = 1;

      const eventInDb = await eventRepository.findOneEvent(Events.byId(id));

      // When
      const result = await eventService.findOneEventById(id);

      // Then
      expect(result).toEqual(eventInDb);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notEventId = 33333333;

      // When & Then
      expect(async () => {
        await eventService.findOneEventById(notEventId);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('createEventWithHastags()', () => {
    const eventCreateProps = {
      title: '없는 제목',
      content: '내용',
      mainThumbnailUrl: '썸네일 이미지',
      brandName: PhotoBoothBrand.byName('업체명'),
      startDate: new Date(),
      endDate: new Date(),
      isPublic: true,
      hashtags: Hashtag.unique([
        '캐릭터',
        '콜라보',
        '연예인',
        '스냅',
        '이달의프레임',
      ]),
      images: ['url1', 'url2', 'url3'].map((image) => EventImage.create(image)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('SUCCESS: 전달 받은 정보로 이벤트 생성', async () => {
      // Given
      const photoBoothBrand = await brandService.findOneBrandBy(
        eventCreateProps.brandName,
      );
      const eventHashtags = await hashtagService.eventHashtags(
        eventCreateProps.hashtags,
      );
      const expectedResult = await eventRepository.save({
        photoBoothBrand,
        eventHashtags,
        ...eventCreateProps,
      });

      // When
      const result =
        await eventService.createEventWithHastags(eventCreateProps);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: 이벤트를 생성해야할 때 업체명이 존재하지 않으면 404 에러', async () => {
      // Given
      eventCreateProps.brandName = PhotoBoothBrand.byName('업체명이 없을 때');

      // When & Then
      expect(async () => {
        await eventService.createEventWithHastags(eventCreateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('updateEventWithHastags()', () => {
    const eventUpdateProps = {
      title: '없는 제목',
      content: '내용',
      mainThumbnailUrl: '썸네일 이미지',
      brandName: PhotoBoothBrand.byName('업체명'),
      startDate: new Date(),
      endDate: new Date(),
      isPublic: true,
      hashtags: Hashtag.unique([
        '캐릭터',
        '콜라보',
        '연예인',
        '스냅',
        '이달의프레임',
      ]),
      images: ['url1', 'url2', 'url3'].map((image) => EventImage.create(image)),
    };

    it('SUCCESS: id 값이 존재할 때 전달 받은 정보로 업데이트', async () => {
      // Given
      const id = 1;
      const photoBoothBrand = await brandService.findOneBrandBy(
        eventUpdateProps.brandName,
      );
      const eventHashtags = await hashtagService.eventHashtags(
        eventUpdateProps.hashtags,
      );
      const expectedResult = await eventRepository.save({
        id,
        photoBoothBrand,
        eventHashtags,
        ...eventUpdateProps,
      });

      // When
      const result = await eventService.updateEventWithHastags(
        id,
        eventUpdateProps,
      );

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notEventId = 222222;
      eventUpdateProps.brandName = PhotoBoothBrand.byName('업체명');

      // When & Then
      expect(async () => {
        await eventService.updateEventWithHastags(notEventId, eventUpdateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });

    it('FAILURE: 수정해야할 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 1;
      eventUpdateProps.brandName = PhotoBoothBrand.byName('업체명이 없을 때');

      // When & Then
      expect(async () => {
        await eventService.updateEventWithHastags(id, eventUpdateProps);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });
});
