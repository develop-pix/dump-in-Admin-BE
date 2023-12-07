import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { EventRepository } from './repository/event.repository';
import { HashtagRepository } from '../hashtag/repository/hastag.repository';

class MockEventRepository {}
class MockHashtagRepository {}

describe('EventService', () => {
  let eventService: EventService;
  let hastagService: HashtagService;
  let eventRepository: EventRepository;
  let hashtagRepository: HashtagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        HashtagService,
        { provide: EventRepository, useClass: MockEventRepository },
        { provide: HashtagRepository, useClass: MockHashtagRepository },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
    hastagService = module.get<HashtagService>(HashtagService);
    eventRepository = module.get<EventRepository>(EventRepository);
    hashtagRepository = module.get<HashtagRepository>(HashtagRepository);
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
    expect(hastagService).toBeDefined();
    expect(eventRepository).toBeDefined();
    expect(hashtagRepository).toBeDefined();
  });
});
