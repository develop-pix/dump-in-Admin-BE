import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { GetStatisticsDto, RawCountByDate } from './dto/get-statistics.dto';
import { ReviewRepository } from '../review/repository/review.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async countUsersByDate(): Promise<GetStatisticsDto[]> {
    const results = await this.userRepository.countUsersByDate();
    if (!results.length) {
      throw new NotFoundException(
        '날짜별 가입 유저수 조회 요청에 실패했습니다.',
      );
    }
    return results.map((result) => new GetStatisticsDto(result));
  }

  async countReviewsByDate(): Promise<GetStatisticsDto[]> {
    const results = await this.reviewRepository.countReviewsByDate();
    if (!results.length) {
      throw new NotFoundException('날짜별 리뷰수 조회 요청에 실패했습니다.');
    }

    return results.map((result) => new GetStatisticsDto(result));
  }

  async combineResultsByDate(): Promise<GetStatisticsDto[]> {
    const [userResults, reviewResults] = await Promise.all([
      this.userRepository.countUsersByDate(),
      this.reviewRepository.countReviewsByDate(),
    ]);

    if (!userResults.length || !reviewResults.length) {
      throw new NotFoundException(
        '날짜별 리뷰수, 가입자수 조회 요청에 실패했습니다.',
      );
    }

    const mergedResults: Map<string, RawCountByDate> = new Map();

    const mergeResult = (result: RawCountByDate): void => {
      const date = result.created;
      const existingResult = mergedResults.get(date);

      if (!existingResult) {
        mergedResults.set(date, {
          created: date,
          user: result.user,
          review: result.review,
        });
      } else {
        existingResult.review += result.review ? result.review : 0;
        existingResult.user += result.user ? result.user : 0;
      }
    };

    [...userResults, ...reviewResults].forEach((result) => mergeResult(result));

    return Array.from(mergedResults.values())
      .map((result) => new GetStatisticsDto(result))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
