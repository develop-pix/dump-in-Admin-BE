import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { GetReviewList } from './dto/get-review-list.dto';
import { GetReviewDetail } from './dto/get-review-detail.dto';
import { ReviewQueryParam } from './dto/req-review-query.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { Review } from './entity/review.entity';
import { HttpStatus } from '@nestjs/common';
import { PageEntity } from '../common/dto/get-pagination-list.dto';

class MockReviewService {
  findReviewByQueryParam = jest.fn();
  findOneReviewById = jest.fn();
  removeReview = jest.fn();
}

describe('ReviewController', () => {
  let reviewController: ReviewController;
  let reviewService: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [{ provide: ReviewService, useClass: MockReviewService }],
    }).compile();

    reviewController = module.get<ReviewController>(ReviewController);
    reviewService = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reviewController).toBeDefined();
    expect(reviewService).toBeDefined();
  });

  describe('findReviewByQueryParam', () => {
    it('SUCCESS: 리뷰 목록 반환', async () => {
      const mockRequest = new ReviewQueryParam();
      const mockResponse = [Review.byId(1), Review.byId(2)];
      const mockCount = 1;

      jest
        .spyOn(reviewService, 'findReviewByQueryParam')
        .mockResolvedValue([mockResponse, mockCount]);

      const result = await reviewController.findReviewByQueryParam(mockRequest);

      expect(reviewService.findReviewByQueryParam).toHaveBeenCalledWith(
        mockRequest.getPageProps(),
        mockRequest.getQueryProps(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH(
          expect.any(String),
          expect.any(PageEntity<GetReviewList>),
        ),
      );
    });
  });

  describe('findOneReviewById', () => {
    it('SUCCESS: 요청한 ID로 리뷰 조회', async () => {
      const mockId = 1;
      const mockResponse = Review.byId(mockId);

      jest
        .spyOn(reviewService, 'findOneReviewById')
        .mockResolvedValue(mockResponse);

      const result = await reviewController.findOneReviewById(mockId);

      expect(result).toEqual(
        ResponseEntity.OK_WITH(expect.any(String), expect.any(GetReviewDetail)),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(reviewService.findOneReviewById).toHaveBeenCalledWith(mockId);
    });
  });

  describe('removeReview', () => {
    it('SUCCESS: 요청한 ID로 리뷰 삭제', async () => {
      const mockId = 1;

      const result = await reviewController.removeReview(mockId);

      expect(result.code).toEqual(HttpStatus.OK);
      expect(reviewService.removeReview).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(ResponseEntity.OK(expect.any(String)));
    });
  });
});
