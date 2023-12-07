import { Test, TestingModule } from '@nestjs/testing';
import { HashtagService } from './hashtag.service';
import { HashtagRepository } from './repository/hastag.repository';

class MockHashtagRepository {}

describe('HashtagService', () => {
  let hashtagService: HashtagService;
  let hashtagRepository: HashtagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagService,
        { provide: HashtagRepository, useClass: MockHashtagRepository },
      ],
    }).compile();

    hashtagService = module.get<HashtagService>(HashtagService);
    hashtagRepository = module.get<HashtagRepository>(HashtagRepository);
  });

  it('should be defined', () => {
    expect(hashtagService).toBeDefined();
    expect(hashtagRepository).toBeDefined();
  });
});
