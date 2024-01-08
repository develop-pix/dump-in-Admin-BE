import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { UserRepository } from '../user/repository/user.repository';
import { ReviewRepository } from '../review/repository/review.repository';
import { RawCountByDate, Statistics } from './dto/get-statistics.dto';

class MockUserRepository {
  countUsersByDate = jest.fn();
}

class MockReviewRepository {
  countReviewsByDate = jest.fn();
}

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let userRepository: UserRepository;
  let reviewRepository: ReviewRepository;
  let expectedUserResults: RawCountByDate[];
  let expectedReviewResults: RawCountByDate[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: UserRepository, useClass: MockUserRepository },
        { provide: ReviewRepository, useClass: MockReviewRepository },
      ],
    }).compile();

    dashboardService = module.get<DashboardService>(DashboardService);
    userRepository = module.get<UserRepository>(UserRepository);
    reviewRepository = module.get<ReviewRepository>(ReviewRepository);

    expectedUserResults = [
      { created: new Date('2022-01-01'), user: 10, review: undefined },
      { created: new Date('2022-01-02'), user: 15, review: undefined },
    ];

    expectedReviewResults = [
      { created: new Date('2022-01-01'), user: undefined, review: 5 },
      { created: new Date('2022-01-02'), user: undefined, review: 8 },
    ];

    jest
      .spyOn(userRepository, 'countUsersByDate')
      .mockResolvedValue(expectedUserResults);

    jest
      .spyOn(reviewRepository, 'countReviewsByDate')
      .mockResolvedValue(expectedReviewResults);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dashboardService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(reviewRepository).toBeDefined();
  });

  describe('countUsersByDate', () => {
    it('SUCESS: 날짜별 가입자수 생성', async () => {
      const results = await dashboardService.countUsersByDate();

      expect(results).toEqual(expectedUserResults);
      expect(userRepository.countUsersByDate).toHaveBeenCalled();
    });
  });

  describe('countReviewsByDate', () => {
    it('SUCESS: 날짜별 리뷰수 생성', async () => {
      const results = await dashboardService.countReviewsByDate();

      expect(results).toEqual(expectedReviewResults);
      expect(reviewRepository.countReviewsByDate).toHaveBeenCalled();
    });
  });

  describe('combineResultsByDate', () => {
    it('SUCESS: 날짜별 가입자수, 리뷰수 통합 생성', async () => {
      const expectedResults: RawCountByDate[] = [
        { created: new Date('2022-01-01'), user: 10, review: 5 },
        { created: new Date('2022-01-02'), user: 15, review: 8 },
      ];

      jest.spyOn(Statistics, 'mergeResults').mockReturnValue(expectedResults);
      jest.spyOn(Statistics, 'compare').mockReturnValue(0);

      const results = await dashboardService.combineResultsByDate();

      expect(results).toEqual(expectedResults);
      expect(userRepository.countUsersByDate).toHaveBeenCalled();
      expect(reviewRepository.countReviewsByDate).toHaveBeenCalled();
      expect(Statistics.mergeResults).toHaveBeenCalledWith([
        ...expectedUserResults,
        ...expectedReviewResults,
      ]);
      expect(Statistics.compare).toHaveBeenCalled();
    });
  });
});
