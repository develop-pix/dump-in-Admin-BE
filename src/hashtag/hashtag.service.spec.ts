import { Test, TestingModule } from '@nestjs/testing';
import { HashtagService } from './hashtag.service';
import { HashtagRepository } from './repository/hastag.repository';
import { BrandHashtagRepository } from './repository/brand-hashtag.repository';
import { EventHashtagRepository } from './repository/event-hashtag.repository';
import { Hashtag } from './entity/hashtag.entity';

class MockHashtagRepository {
  save = jest.fn();
  findManyHashtagByOption = jest.fn();
}

class MockBrandHashtagRepository {}

class MockEventHashtagRepository {}

describe('HashtagService', () => {
  let hashtagService: HashtagService;
  let hashtagRepository: HashtagRepository;
  let brandHashtagRepo: BrandHashtagRepository;
  let eventHashtagRepo: EventHashtagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashtagService,
        { provide: HashtagRepository, useClass: MockHashtagRepository },
        {
          provide: BrandHashtagRepository,
          useClass: MockBrandHashtagRepository,
        },
        {
          provide: EventHashtagRepository,
          useClass: MockEventHashtagRepository,
        },
      ],
    }).compile();

    hashtagService = module.get<HashtagService>(HashtagService);
    hashtagRepository = module.get<HashtagRepository>(HashtagRepository);
    brandHashtagRepo = module.get<BrandHashtagRepository>(
      BrandHashtagRepository,
    );
    eventHashtagRepo = module.get<EventHashtagRepository>(
      EventHashtagRepository,
    );

    jest
      .spyOn(hashtagRepository, 'save')
      .mockImplementation((hashtag: Hashtag) => {
        return Promise.resolve(hashtag);
      });

    jest
      .spyOn(hashtagRepository, 'findManyHashtagByOption')
      .mockImplementation((hashtags: Hashtag[]) => {
        return Promise.resolve(hashtags);
      });
  });

  it('should be defined', () => {
    expect(hashtagService).toBeDefined();
    expect(hashtagRepository).toBeDefined();
    expect(brandHashtagRepo).toBeDefined();
    expect(eventHashtagRepo).toBeDefined();
  });

  describe('createHashtags()', () => {
    it('SUCCESS: 해시태그 이름을 넣으면 해시태그 생성', async () => {
      // Given
      const hashtagNames = ['1', '2', '3'];

      const hashtagInDb = hashtagNames.map((name) => Hashtag.create(name));

      // When
      const result = await hashtagService.createHashtags(hashtagInDb);

      // Then
      expect(result).toEqual(hashtagInDb);
    });
  });
});
