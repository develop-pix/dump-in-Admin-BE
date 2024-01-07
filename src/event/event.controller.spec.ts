import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventQueryParam } from './dto/req-event-query.dto';
import { GetEventList } from './dto/get-event-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { CreateEvent } from './dto/post-event.dto';
import { GetEventDetail } from './dto/get-event-detail.dto';
import { Events } from './entity/event.entity';
import { HttpStatus } from '@nestjs/common';
import { UpdateEvent } from './dto/patch-event.dto';

class MockEventService {
  findEventByQueryParam = jest.fn();
  createEventWithHastags = jest.fn();
  findOneEventById = jest.fn();
  updateEventWithHastags = jest.fn();
}

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useClass: MockEventService }],
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findEventByQueryParam', () => {
    it('SUCCESS: 이벤트 목록 반환', async () => {
      const mockResponse = [new Events()];
      const mockCount = 1;
      const mockRequest = new EventQueryParam();
      mockRequest.brandName = 'test';
      mockRequest.title = 'test';

      jest
        .spyOn(eventService, 'findEventByQueryParam')
        .mockResolvedValue([mockResponse, mockCount]);

      const result = await controller.findEventByQueryParam(mockRequest);

      expect(eventService.findEventByQueryParam).toHaveBeenCalledWith(
        mockRequest.getPageProps(),
        mockRequest.getQueryProps(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetEventList>>(
          expect.any(String),
          expect.any(PageEntity<GetEventList>),
        ),
      );
    });
  });

  describe('createEvent', () => {
    it('SUCCESS: 이벤트 생성', async () => {
      const mockRequest = new CreateEvent();
      mockRequest.title = 'Test Title';
      mockRequest.content = 'Test Content';
      mockRequest.mainThumbnailUrl = 'test-url';
      mockRequest.brandName = 'Test Brand';
      mockRequest.isPublic = true;
      mockRequest.startDate = new Date('2024-01-01');
      mockRequest.endDate = new Date('2024-01-10');
      mockRequest.hashtags = [
        '캐릭터',
        '콜라보',
        '연예인',
        '스냅',
        '이달의프레임',
      ];
      mockRequest.images = ['url', 'url2', 'url3', 'url4'];

      const result = await controller.createEvent(mockRequest);

      expect(eventService.createEventWithHastags).toHaveBeenCalledWith(
        mockRequest.toCreateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.CREATED);
      expect(result).toEqual(ResponseEntity.CREATED(expect.any(String)));
    });
  });

  describe('findOneEvent', () => {
    it('SUCCESS: 요청한 ID로 이벤트 반환', async () => {
      const mockId = 1;
      const mockResponse = new Events();

      jest
        .spyOn(eventService, 'findOneEventById')
        .mockResolvedValue(mockResponse);

      const result = await controller.findOneEvent(mockId);

      expect(eventService.findOneEventById).toHaveBeenCalledWith(mockId);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<GetEventDetail>(
          expect.any(String),
          expect.any(GetEventDetail),
        ),
      );
    });
  });

  describe('updateEvent', () => {
    it('SUCCESS: 포토부스 업체 수정', async () => {
      const mockId = 1;
      const mockRequest = new UpdateEvent();
      mockRequest.title = 'Test Title';
      mockRequest.content = 'Test Content';
      mockRequest.mainThumbnailUrl = 'test-url';
      mockRequest.brandName = 'Test Brand';
      mockRequest.isPublic = true;
      mockRequest.startDate = new Date('2024-01-01');
      mockRequest.endDate = new Date('2024-01-10');
      mockRequest.hashtags = [
        '캐릭터',
        '콜라보',
        '연예인',
        '스냅',
        '이달의프레임',
      ];
      mockRequest.images = ['url', 'url2', 'url3', 'url4'];

      const result = await controller.updateEvent(mockId, mockRequest);

      expect(eventService.updateEventWithHastags).toHaveBeenCalledWith(
        mockId,
        mockRequest.toUpdateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
    });
  });
});
