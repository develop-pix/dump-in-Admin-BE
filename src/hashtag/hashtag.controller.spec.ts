import { Test, TestingModule } from '@nestjs/testing';
import { HashtagController } from './hashtag.controller';
import { HashtagService } from './hashtag.service';
import { GetHashtagList } from './dto/get-hastag-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { Hashtag } from './entity/hashtag.entity';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { HttpStatus } from '@nestjs/common';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { CreateHashtags } from './dto/post-hashtag.dto';

class MockHashtagService {
  findAllHashtags = jest.fn();
  createHashtags = jest.fn();
}

describe('HashtagController', () => {
  let hashtagController: HashtagController;
  let hashtagService: HashtagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HashtagController],
      providers: [{ provide: HashtagService, useClass: MockHashtagService }],
    }).compile();

    hashtagController = module.get<HashtagController>(HashtagController);
    hashtagService = module.get<HashtagService>(HashtagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(hashtagController).toBeDefined();
    expect(hashtagService).toBeDefined();
  });

  describe('findAllHashtags', () => {
    it('SUCCESS: 해시태그 목록 반환', async () => {
      const mockRequest = new PaginationDto();
      const mockResponse = [new Hashtag()];
      const mockCount = 2;

      jest
        .spyOn(hashtagService, 'findAllHashtags')
        .mockResolvedValue([mockResponse, mockCount]);

      const result = await hashtagController.findAllHashtags(mockRequest);

      expect(hashtagService.findAllHashtags).toHaveBeenCalledWith(
        mockRequest.getPageProps(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetHashtagList>>(
          expect.any(String),
          expect.any(PageEntity<GetHashtagList>),
        ),
      );
    });
  });

  describe('createHashtags', () => {
    it('SUCCESS: 요청 받은 배열 String을 해시태그 생성', async () => {
      const mockRequest = new CreateHashtags();

      const result = await hashtagController.createHashtags(mockRequest);

      expect(hashtagService.createHashtags).toHaveBeenCalledWith(
        mockRequest.toCreateEntity(),
      );
      expect(result.code).toEqual(HttpStatus.CREATED);
      expect(result).toEqual(ResponseEntity.CREATED(expect.any(String)));
    });
  });
});
