import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { Statistics, RawCountByDate } from './dto/get-statistics.dto';
import { ReviewRepository } from '../review/repository/review.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  /**
   * @desc 날짜별 가입 유저수 조회
   */
  countUsersByDate(): Promise<RawCountByDate[]> {
    return this.userRepository.countUsersByDate();
  }

  /**
   * @desc 날짜별 리뷰 작성수 조회
   */
  countReviewsByDate(): Promise<RawCountByDate[]> {
    return this.reviewRepository.countReviewsByDate();
  }

  /**
   * @desc 날짜별 리뷰 작성수와 가입 유저수를 종합한 결과 조회
   */
  async combineResultsByDate(): Promise<RawCountByDate[]> {
    const [userResults, reviewResults] = await Promise.all([
      this.countUsersByDate(),
      this.countReviewsByDate(),
    ]);

    return Statistics.mergeResults([...userResults, ...reviewResults]).sort(
      (a, b) => Statistics.compare(a, b),
    );
  }
}
