import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { ReviewRepository } from './repository/review.repository';
import { NotFoundException } from '@nestjs/common';
import { Review } from './entity/review.entity';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { FindReviewOptionsProps } from './dto/get-review-query.dto';

class MockReviewRepository {
  findReviewByOptionAndCount = jest.fn();
  findOneReview = jest.fn();
  updateReview = jest.fn();
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
          return Promise.resolve([[], 0]);
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
          return Promise.resolve(null);
        }
      });

    jest
      .spyOn(reviewRepository, 'updateReview')
      .mockImplementation((id: number) => {
        if (id === 1) {
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
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
      const queryProps: FindReviewOptionsProps = {
        boothName: '지점명',
        nickname: undefined,
      };

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of(queryProps),
          pageProps,
        );

      const expectedResult = reviewInDb.map(
        (result) => new GetReviewListDto(result),
      );

      // When
      const [result, resultCount] = await reviewService.findReviewByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(expectedResult);
      expect(countInDb).toEqual(resultCount);
    });

    it('SUCCESS: 유저 닉네임으로 쿼리했을 때 데이터와 데이터 개수 반환', async () => {
      // Given
      const queryProps: FindReviewOptionsProps = {
        boothName: undefined,
        nickname: '유저 닉네임',
      };

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of(queryProps),
          pageProps,
        );

      const expectedResult = reviewInDb.map(
        (result) => new GetReviewListDto(result),
      );

      // When
      const [result, resultCount] = await reviewService.findReviewByQueryParam(
        pageProps,
        queryProps,
      );

      // Then
      expect(result).toEqual(expectedResult);
      expect(countInDb).toEqual(resultCount);
    });

    it('FAILURE: 포토부스 지점명으로 쿼리했을 때 리뷰가 존재하지 않으면 404 에러', async () => {
      // Given
      const queryProps: FindReviewOptionsProps = {
        boothName: '없는 지점명',
        nickname: undefined,
      };

      // When & Then
      expect(async () => {
        await reviewService.findReviewByQueryParam(pageProps, queryProps);
      }).rejects.toThrowError(new NotFoundException('리뷰를 찾지 못했습니다'));
    });

    it('FAILURE: 유저 닉네임으로 쿼리했을 때 리뷰가 존재하지 않으면 404 에러', async () => {
      // Given
      const queryProps: FindReviewOptionsProps = {
        nickname: '없는 유저 닉네임',
        boothName: undefined,
      };

      // When & Then
      expect(async () => {
        await reviewService.findReviewByQueryParam(pageProps, queryProps);
      }).rejects.toThrowError(new NotFoundException('리뷰를 찾지 못했습니다'));
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
      }).rejects.toThrowError(new NotFoundException('리뷰를 찾지 못했습니다.'));
    });
  });

  describe('removeReview()', () => {
    it('SUCCESS: id 값이 존재할 때 리뷰 삭제', async () => {
      // Given
      const id = 1;

      const reviewInDb = await reviewRepository.updateReview(
        id,
        Review.delete(true),
      );

      // When
      const result = await reviewService.removeReview(id);

      // Then
      expect(result).toEqual(reviewInDb);
    });

    it('FAILURE: id 값이 존재하지 않을 때 404 에러', async () => {
      // Given
      const notReviewId = 33333333;

      // When & Then
      expect(async () => {
        await reviewService.removeReview(notReviewId);
      }).rejects.toThrowError(
        new NotFoundException('리뷰 삭제가 불가능합니다.'),
      );
    });
  });
});
