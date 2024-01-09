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
  let eventController: EventController;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [{ provide: EventService, useClass: MockEventService }],
    }).compile();

    eventController = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(eventController).toBeDefined();
    expect(eventService).toBeDefined();
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

      const result = await eventController.findEventByQueryParam(mockRequest);

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
      const mockResponse = new Events();
      mockRequest.toCreateEntity = jest.fn().mockReturnValue(mockResponse);

      jest
        .spyOn(eventService, 'createEventWithHastags')
        .mockResolvedValue(mockResponse);

      const result = await eventController.createEvent(mockRequest);

      expect(eventService.createEventWithHastags).toHaveBeenCalledWith(
        mockRequest.toCreateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.CREATED);
      expect(result).toEqual(ResponseEntity.CREATED(expect.any(String)));
    });
  });

  describe('findOneEvent', () => {
    it('SUCCESS: 요청한 ID로 이벤트 조회', async () => {
      const mockId = 1;
      const mockResponse = new Events();

      jest
        .spyOn(eventService, 'findOneEventById')
        .mockResolvedValue(mockResponse);

      const result = await eventController.findOneEvent(mockId);

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
    it('SUCCESS: 요청한 ID로 이벤트 수정', async () => {
      const mockId = 1;
      const mockResponse = new Events();
      const mockRequest = new UpdateEvent();
      mockRequest.toUpdateEntity = jest.fn().mockReturnValue(mockResponse);

      jest
        .spyOn(eventService, 'updateEventWithHastags')
        .mockResolvedValue(mockResponse);

      const result = await eventController.updateEvent(mockId, mockRequest);

      expect(eventService.updateEventWithHastags).toHaveBeenCalledWith(
        mockId,
        mockRequest.toUpdateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
    });
  });
});
