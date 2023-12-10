import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';
import { UserService } from '../user/user.service';
import { ReviewRepository } from './repository/review.repository';
import { User } from '../user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { PhotoBooth } from '../photo-booth/entity/photo-booth.entity';
import { Review } from './entity/review.entity';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { FindReviewOptionsProps } from './dto/get-review-query.dto';

class MockReviewRepository {
  findReviewByOptionAndCount = jest.fn();
  findOneReviewBy = jest.fn();
  updateReview = jest.fn();
}

class MockUserService {
  findOneUserByNickname = jest.fn();
}

class MockPhotoBoothService {
  findOneOpenBoothByName = jest.fn();
}

describe('ReviewService', () => {
  let userService: UserService;
  let reviewService: ReviewService;
  let reviewRepository: ReviewRepository;
  let photoBoothService: PhotoBoothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: UserService, useClass: MockUserService },
        { provide: ReviewRepository, useClass: MockReviewRepository },
        { provide: PhotoBoothService, useClass: MockPhotoBoothService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    reviewService = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);
    photoBoothService = module.get<PhotoBoothService>(PhotoBoothService);

    jest
      .spyOn(reviewRepository, 'findReviewByOptionAndCount')
      .mockImplementation((review: Review) => {
        if (review.photo_booth) {
          const savedReview = new Review();
          savedReview.photo_booth = review.photo_booth;
          return Promise.resolve([[savedReview], 1]);
        } else if (review.user) {
          const savedReview = new Review();
          savedReview.user = review.user;
          return Promise.resolve([[savedReview], 1]);
        } else {
          return Promise.resolve([[], 0]);
        }
      });

    jest
      .spyOn(reviewRepository, 'findOneReviewBy')
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

    jest
      .spyOn(userService, 'findOneUserByNickname')
      .mockImplementation((name: string) => {
        if (name === '유저 닉네임') {
          const savedUser = new User();
          savedUser.nickname = '유저 닉네임';
          return Promise.resolve(savedUser);
        } else if (typeof name === 'undefined') {
          return Promise.resolve(name);
        } else {
          return Promise.reject(
            new NotFoundException('유저 정보를 찾지 못했습니다'),
          );
        }
      });

    jest
      .spyOn(photoBoothService, 'findOneOpenBoothByName')
      .mockImplementation((name: string) => {
        if (name === '지점명') {
          const savedPhotoBooth = new PhotoBooth();
          savedPhotoBooth.name = '지점명';
          return Promise.resolve(savedPhotoBooth);
        } else if (typeof name === 'undefined') {
          return Promise.resolve(name);
        } else {
          return Promise.reject(
            new NotFoundException('포토부스 지점을 찾지 못했습니다'),
          );
        }
      });
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(reviewService).toBeDefined();
    expect(reviewRepository).toBeDefined();
    expect(photoBoothService).toBeDefined();
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
      };

      const photoBooth = new PhotoBooth();
      photoBooth.name = queryProps.boothName;

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of({ photoBooth }),
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
        userName: '유저 닉네임',
      };

      const user = new User();
      user.nickname = queryProps.userName;

      const [reviewInDb, countInDb] =
        await reviewRepository.findReviewByOptionAndCount(
          Review.of({ user }),
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
      };

      // When & Then
      expect(async () => {
        await reviewService.findReviewByQueryParam(pageProps, queryProps);
      }).rejects.toThrowError(
        new NotFoundException('포토부스 지점을 찾지 못했습니다'),
      );
    });

    it('FAILURE: 유저 닉네임으로 쿼리했을 때 리뷰가 존재하지 않으면 404 에러', async () => {
      // Given
      const queryProps: FindReviewOptionsProps = {
        userName: '없는 유저 닉네임',
      };

      // When & Then
      expect(async () => {
        await reviewService.findReviewByQueryParam(pageProps, queryProps);
      }).rejects.toThrowError(
        new NotFoundException('유저 정보를 찾지 못했습니다'),
      );
    });
  });

  describe('findOneEventById()', () => {
    it('SUCCESS: id 값이 존재할 때 데이터 반환', async () => {
      // Given
      const id = 1;

      const reviewInDb = await reviewRepository.findOneReviewBy(
        Review.byId(id),
      );

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
