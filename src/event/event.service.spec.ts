import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { EventRepository } from './repository/event.repository';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';

class MockEventRepository {}
class MockHashtagService {}
class MockPhotoBoothService {}

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
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    expect(hastagService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(photoBoothService).toBeDefined();
  });
});
