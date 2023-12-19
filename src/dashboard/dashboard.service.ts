import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { RawCountByDate } from './dto/get-statistics.dto';
import { ReviewRepository } from '../review/repository/review.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  /**
   * @desc  * 날짜별 가입 유저수 조회
   */
  async countUsersByDate(): Promise<RawCountByDate[]> {
    const results = await this.userRepository.countUsersByDate();
    if (!results.length) {
      throw new NotFoundException(
        '날짜별 가입 유저수 조회 요청에 실패했습니다.',
      );
    }
    return results;
  }

  /**
   * @desc  * 날짜별 리뷰 작성수 조회
   */
  async countReviewsByDate(): Promise<RawCountByDate[]> {
    const results = await this.reviewRepository.countReviewsByDate();
    if (!results.length) {
      throw new NotFoundException('날짜별 리뷰수 조회 요청에 실패했습니다.');
    }
    return results;
  }

  /**
   * @desc  * 날짜별 리뷰 작성수와 가입 유저수를 종합한 결과 조회
   */
  async combineResultsByDate(): Promise<RawCountByDate[]> {
    const [userResults, reviewResults] = await Promise.all([
      this.countUsersByDate(),
      this.countReviewsByDate(),
    ]);

    const mergedResults: Map<string, RawCountByDate> = new Map();

    const mergeResult = (result: RawCountByDate): void => {
      const date = result.created.toISOString();
      const existingResult = mergedResults.get(date);

      if (!existingResult) {
        mergedResults.set(date, {
          created: new Date(date),
          user: result.user,
          review: result.review,
        });
      } else {
        existingResult.review += result.review ? result.review : 0;
        existingResult.user += result.user ? result.user : 0;
      }
    };

    [...userResults, ...reviewResults].forEach((result) => mergeResult(result));

    return Array.from(mergedResults.values()).sort(
      (a, b) => b.created.getTime() - a.created.getTime(),
    );
  }
}
