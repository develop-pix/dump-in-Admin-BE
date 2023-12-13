import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { EventRepository } from './repository/event.repository';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';
import { Events } from './entity/event.entity';
import { GetEventListDto } from './dto/get-event-list.dto';
import { NotFoundException } from '@nestjs/common';

class MockEventRepository {
  saveEvent = jest.fn();
  findEventByOptionAndCount = jest.fn();
  findOneEvent = jest.fn();
  updateEvent = jest.fn();
}

class MockHashtagService {
  handleHashtags = jest.fn();
}

class MockPhotoBoothService {
  isExistByBrandName = jest.fn();
}

describe('EventService', () => {
  let eventService: EventService;
  let hastagService: HashtagService;
  let eventRepository: EventRepository;
  let photoBoothService: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: HashtagService, useClass: MockHashtagService },
        { provide: EventRepository, useClass: MockEventRepository },
        { provide: PhotoBoothService, useClass: MockPhotoBoothService },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    hastagService = module.get<HashtagService>(HashtagService);
    eventRepository = module.get<EventRepository>(EventRepository);
    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);

    jest
      .spyOn(eventRepository, 'saveEvent')
      .mockImplementation((event: Events) => {
        if (event.title === '없는 제목') {
          const saveEvent = new Events();
          return Promise.resolve(saveEvent);
        } else {
          return Promise.resolve(null);
        }
      });

    jest
      .spyOn(eventRepository, 'findEventByOptionAndCount')
      .mockImplementation((event: Events) => {
        if (event.title === '이벤트 제목') {
          const saveEvent = new Events();
          saveEvent.id = 1;
          saveEvent.title = '이벤트 제목';
          saveEvent.content = '이벤트 내용';
          return Promise.resolve([[saveEvent], 1]);
        } else {
          return Promise.resolve([[], 0]);
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
          return Promise.resolve(null);
        }
      });

    jest
      .spyOn(eventRepository, 'updateEvent')
      .mockImplementation((id: number) => {
        if (id === 1) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      });

    jest
      .spyOn(photoBoothService, 'isExistByBrandName')
      .mockImplementation((name: string) => {
        if (name === '업체명') {
          return Promise.resolve(true);
        } else if (typeof name === 'undefined') {
          return Promise.resolve(name);
        } else {
          return Promise.reject(
            new NotFoundException('포토부스 업체를 찾지 못했습니다.'),
          );
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    expect(hastagService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(photoBoothService).toBeDefined();
  });

  describe('findEventByQueryParam()', () => {
    const pageProps = {
      take: 10,
      skip: 1,
      page: 1,
    };
    const queryProps = {
      title: undefined,
      brandName: undefined,
    };

    it('SUCCESS: 이벤트 제목으로 쿼리하면 관련 데이터 여러개 반환', async () => {
      // Given
      queryProps.title = '이벤트 제목';

      const [eventInDb, countInDb] =
        await eventRepository.findEventByOptionAndCount(
          Events.of(queryProps),
          pageProps,
        );

      const expectedResult = eventInDb.map(
        (result) => new GetEventListDto(result),
      );

      // When
      const [result, resultCount] = await eventService.findEventByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(expectedResult);
      expect(countInDb).toEqual(resultCount);
    });

    it('SUCCESS: 포토부스 업체명으로 쿼리하면 관련 이벤트 데이터 여러개 반환', async () => {
      // Given
      queryProps.brandName = '업체명';

      const [eventInDb, countInDb] =
        await eventRepository.findEventByOptionAndCount(
          Events.of(queryProps),
          pageProps,
        );

      const expectedResult = eventInDb.map(
        (result) => new GetEventListDto(result),
      );

      // When
      const [result, resultCount] = await eventService.findEventByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(expectedResult);
      expect(countInDb).toEqual(resultCount);
    });

    it('FAILURE: 이벤트가 존재하지 않으면 404 에러', async () => {
      // Given
      queryProps.title = '이벤트에 없는 제목';

      // When & Then
      expect(async () => {
        await eventService.findEventByQueryParam(pageProps, queryProps);
      }).rejects.toThrowError(
        new NotFoundException('이벤트를 찾지 못했습니다'),
      );
    });

    it('FAILURE: 포토부스 업체명으로 쿼리했을 때 이벤트가 존재하지 않으면 404 에러', async () => {
      // Given
      queryProps.brandName = '없는 업체명';

      // When & Then
      expect(async () => {
        await eventService.findEventByQueryParam(
          pageProps,
          Events.of(queryProps),
        );
      }).rejects.toThrowError(
        new NotFoundException('이벤트를 찾지 못했습니다'),
      );
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
      }).rejects.toThrowError(
        new NotFoundException('이벤트를 찾지 못했습니다.'),
      );
    });
  });

  describe('createEventWithHastags()', () => {
    const eventCreateProps = {
      title: '없는 제목',
      content: '내용',
      mainThumbnailUrl: '썸네일 이미지',
      brandName: '업체명',
      startDate: new Date(),
      endDate: new Date(),
      isPublic: true,
      hashtags: ['캐릭터', '콜라보', '연예인', '스냅', '이달의프레임'],
    };

    it('SUCCESS: 전달 받은 정보로 이벤트 생성 (boolean)', async () => {
      // Given

      const expectedResult = !!(await eventRepository.saveEvent(
        Events.create(eventCreateProps),
      ));

      // When
      const result =
        await eventService.createEventWithHastags(eventCreateProps);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('FAILURE: 이벤트를 생성해야할 때 업체명이 존재하지 않으면 404 에러', async () => {
      // Given
      eventCreateProps.brandName = '업체명이 없을 때';

      // When & Then
      expect(async () => {
        await eventService.createEventWithHastags(eventCreateProps);
      }).rejects.toThrowError(
        new NotFoundException('포토부스 업체를 찾지 못했습니다.'),
      );
    });
  });

  describe('updateEventWithHastags()', () => {
    const eventUpdateProps = {
      title: '제목',
      content: '내용',
      mainThumbnailUrl: '썸네일 이미지',
      brandName: undefined,
      startDate: new Date(),
      endDate: new Date(),
      isPublic: true,
      hashtags: ['캐릭터', '콜라보', '연예인', '스냅', '이달의프레임'],
    };

    it('SUCCESS: id 값이 존재할 때 전달 받은 정보로 업데이트 (boolean)', async () => {
      // Given
      const id = 1;

      const eventInDb = await eventRepository.updateEvent(
        id,
        Events.updateBy(eventUpdateProps),
      );

      // When
      const result = await eventService.updateEventWithHastags(
        id,
        eventUpdateProps,
      );

      // Then
      expect(result).toEqual(eventInDb);
    });

    it('SUCCESS: 수정할 속성에 업체명이 존재할 때 업체명 업데이트 (boolean)', async () => {
      // Given
      const id = 1;
      eventUpdateProps.brandName = '업체명';

      const eventInDb = await eventRepository.updateEvent(
        id,
        Events.updateBy(eventUpdateProps),
      );

      // When
      const result = await eventService.updateEventWithHastags(
        id,
        eventUpdateProps,
      );

      // Then
      expect(result).toEqual(eventInDb);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notEventId = 222222;
      eventUpdateProps.brandName = '업체명';

      // When & Then
      expect(async () => {
        await eventService.updateEventWithHastags(notEventId, eventUpdateProps);
      }).rejects.toThrowError(
        new NotFoundException(
          `이벤트가 업데이트되지 않았습니다. ID:${notEventId}`,
        ),
      );
    });

    it('FAILURE: 수정해야할 업체명이 존재하지 않을 때 404 에러', async () => {
      // Given
      const id = 1;
      eventUpdateProps.brandName = '업체명이 없을 때';

      // When & Then
      expect(async () => {
        await eventService.updateEventWithHastags(id, eventUpdateProps);
      }).rejects.toThrowError(
        new NotFoundException('포토부스 업체를 찾지 못했습니다.'),
      );
    });
  });
});
