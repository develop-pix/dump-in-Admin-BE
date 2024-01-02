import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { FindReviewOptionsProps } from './dto/get-review-query.dto';
import { ReviewRepository } from './repository/review.repository';
import { Review } from './entity/review.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  /**
   * @param pageProps - pagination (항목수, 페이지)
   * @param query - Request Query (업체명, 유저 닉네임)
   * @desc - 쿼리 파라미터에 맞는 리뷰 목록 조회
   *       - 쿼리 옵션이 없으면 전체 리뷰 조회
   */
  findReviewByQueryParam(
    pageProps: PaginationProps,
    query: FindReviewOptionsProps,
  ): Promise<[Review[], number]> {
    return this.reviewRepository.findReviewByOptionAndCount(
      Review.of(query),
      pageProps,
    );
  }

  /**
   * @param id - 리뷰 id
   * @desc 해당 리뷰 데이터 조회
   */
  async findOneReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOneReview(Review.byId(id));

    if (!review) {
      throw new NotFoundException('리뷰를 찾지 못했습니다.');
    }

    return review;
  }

  /**
   * @param id - 삭제할 리뷰 id
   * @desc 해당 리뷰의 is_deleted 컬럼을 true로 수정 (soft)
   */
  async removeReview(id: number): Promise<boolean> {
    const isExistReview = this.reviewRepository.hasId(Review.byId(id));

    if (!isExistReview) {
      throw new NotFoundException('리뷰를 찾지 못했습니다.');
    }

    await this.reviewRepository.save(
      plainToInstance(Review, { id, isDeleted: true }),
    );

    return true;
  }
}
