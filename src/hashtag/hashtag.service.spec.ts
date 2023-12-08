import { Test, TestingModule } from '@nestjs/testing';
import { HashtagService } from './hashtag.service';
import { HashtagRepository } from './repository/hastag.repository';
import { EntityToHashtagRepository } from './repository/entity-hashtag.repository';

class MockHashtagRepository {}

class MockEntityToHashtagRepository {}

describe('HashtagService', () => {
  let hashtagService: HashtagService;
  let hashtagRepository: HashtagRepository;
  let entityToHashtagRepository: EntityToHashtagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagService,
        { provide: HashtagRepository, useClass: MockHashtagRepository },
        {
          provide: EntityToHashtagRepository,
          useClass: MockEntityToHashtagRepository,
        },
      ],
    }).compile();

    hashtagService = module.get<HashtagService>(HashtagService);
    hashtagRepository = module.get<HashtagRepository>(HashtagRepository);
    entityToHashtagRepository = module.get<EntityToHashtagRepository>(
      EntityToHashtagRepository,
    );
  });

  it('should be defined', () => {
    expect(hashtagService).toBeDefined();
    expect(hashtagRepository).toBeDefined();
    expect(entityToHashtagRepository).toBeDefined();
  });
});
