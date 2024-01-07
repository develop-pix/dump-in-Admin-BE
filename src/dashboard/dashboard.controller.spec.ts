import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ResponseEntity } from '../common/entity/response.entity';
import { Statistics } from './dto/get-statistics.dto';
import { HttpStatus } from '@nestjs/common';

class MockDashboardService {
  combineResultsByDate = jest.fn().mockResolvedValue([]);
  countUsersByDate = jest.fn().mockResolvedValue([]);
  countReviewsByDate = jest.fn().mockResolvedValue([]);
}

describe('DashboardController', () => {
  let dashboardController: DashboardController;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compile();

    dashboardController = module.get<DashboardController>(DashboardController);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(dashboardController).toBeDefined();
  });

  describe('combineResultsByDate', () => {
    it('should return combined results by date', async () => {
      const expectedResult: ResponseEntity<Statistics[]> =
        ResponseEntity.OK_WITH('날짜별 리뷰수, 가입자수 입니다.', []);

      jest
        .spyOn(dashboardService, 'combineResultsByDate')
        .mockResolvedValue([]);

      const result = await dashboardController.combineResultsByDate();

      expect(result).toEqual(expectedResult);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(dashboardService.combineResultsByDate).toHaveBeenCalled();
    });
  });

  describe('countUsersByDate', () => {
    it('should return count of users by date', async () => {
      const expectedResult: ResponseEntity<Statistics[]> =
        ResponseEntity.OK_WITH('날짜별 유저수 입니다.', []);
      jest.spyOn(dashboardService, 'countUsersByDate').mockResolvedValue([]);

      const result = await dashboardController.countUsersByDate();

      expect(result).toEqual(expectedResult);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(dashboardService.countUsersByDate).toHaveBeenCalled();
    });
  });

  describe('countReviewsByDate', () => {
    it('should return count of reviews by date', async () => {
      const expectedResult: ResponseEntity<Statistics[]> =
        ResponseEntity.OK_WITH('날짜별 리뷰수 입니다.', []);

      jest.spyOn(dashboardService, 'countReviewsByDate').mockResolvedValue([]);

      const result = await dashboardController.countReviewsByDate();

      expect(result).toEqual(expectedResult);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(dashboardService.countReviewsByDate).toHaveBeenCalled();
    });
  });
});
