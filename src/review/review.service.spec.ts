import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { ReviewRepository } from './repository/review.repository';
import { NotFoundException } from '@nestjs/common';
import { Review } from './entity/review.entity';

class MockReviewRepository {
  findReviewByOptionAndCount = jest.fn();
  findOneReview = jest.fn();
  updateReview = jest.fn();
  save = jest.fn();
}

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: ReviewRepository, useClass: MockReviewRepository },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);

    jest
      .spyOn(reviewRepository, 'findReviewByOptionAndCount')
      .mockImplementation((review: Review) => {
        const savedReview = new Review();
        if (review.photoBooth?.name === '지점명') {
          savedReview.photoBooth = review.photoBooth;
          return Promise.resolve([[savedReview], 1]);
        } else if (review.user?.nickname === '유저 닉네임') {
          savedReview.user = review.user;
          return Promise.resolve([[savedReview], 1]);
        } else {
          return Promise.resolve([[savedReview], 0]);
        }
      });

    jest
      .spyOn(reviewRepository, 'findOneReview')
      .mockImplementation((review: Review) => {
        if (review.id === 1) {
          const savedReview = new Review();
          savedReview.id = review.id;
          return Promise.resolve(savedReview);
        } else {
          return Promise.reject(new NotFoundException('EntityNotFoundError'));
        }
      });

    jest
      .spyOn(reviewRepository, 'save')
      .mockImplementation((review: Review) => {
        return Promise.resolve(review);
      });
  });

  it('should be defined', () => {
    expect(reviewService).toBeDefined();
    expect(reviewRepository).toBeDefined();
  });

  describe('findReviewByQueryParam()', () => {
    const pageProps = {
      take: 10,
      skip: 1,
      page: 1,
    };

    it('SUCCESS: 포토부스 지점명으로 쿼리했을 때 데이터와 데이터 개수 반환', async () => {
      // Given
      const queryProps = {
        boothName: '지점명',
        nickname: undefined,
      };

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await reviewService.findReviewByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(reviewInDb);
      expect(countInDb).toEqual(resultCount);
    });

    it('SUCCESS: 유저 닉네임으로 쿼리했을 때 데이터와 데이터 개수 반환', async () => {
      // Given
      const queryProps = {
        boothName: undefined,
        nickname: '유저 닉네임',
      };

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await reviewService.findReviewByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(reviewInDb);
      expect(countInDb).toEqual(resultCount);
    });

    it('SUCCESS: 쿼리 조건이 없을 때 전체 데이터 반환', async () => {
      // Given
      const queryProps = {
        boothName: undefined,
        nickname: undefined,
      };

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of(queryProps),
          pageProps,
        );

      // When
      const [result, resultCount] = await reviewService.findReviewByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(reviewInDb);
      expect(countInDb).toEqual(resultCount);
    });
  });

  describe('findOneEventById()', () => {
    it('SUCCESS: id 값이 존재할 때 데이터 반환', async () => {
      // Given
      const id = 1;

      const reviewInDb = await reviewRepository.findOneReview(Review.byId(id));

      // When
      const result = await reviewService.findOneReviewById(id);

      // Then
      expect(result).toEqual(reviewInDb);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notReviewId = 33333333;

      // When & Then
      expect(async () => {
        await reviewService.findOneReviewById(notReviewId);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });

  describe('removeReview()', () => {
    it('SUCCESS: id 값이 존재할 때 리뷰 삭제', async () => {
      // Given
      const id = 1;

      const removedReview = await reviewRepository.save({
        id,
        isDeleted: true,
      });
      // When
      const result = await reviewService.removeReview(id);

      // Then
      expect(result).toEqual(removedReview);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notReviewId = 33333333;

      // When & Then
      expect(async () => {
        await reviewService.removeReview(notReviewId);
      }).rejects.toThrowError(new NotFoundException('EntityNotFoundError'));
    });
  });
});
