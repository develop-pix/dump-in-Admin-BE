import { Injectable } from '@nestjs/common';
import { PaginationProps } from '../common/dto/get-pagination-query.dto';
import { ReviewRepository } from './repository/review.repository';
import { Review } from './entity/review.entity';
import { FindReviewOptionsProps } from './reivew.interface';

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
   * @throws 존재하지 않는 리뷰 (EntityNotFoundError)
   */
  findOneReviewById(id: number): Promise<Review> {
    return this.reviewRepository.findOneReview(Review.byId(id));
  }

  /**
   * @param id - 삭제할 리뷰 id
   * @desc 해당 리뷰의 is_deleted 컬럼을 true로 수정 (soft)
   * @see {@link findOneReviewById} 를 호출하여 리뷰를 찾습니다.
   */
  async removeReview(id: number): Promise<Review> {
    await this.findOneReviewById(id);
    return this.reviewRepository.save({ id, isDeleted: true });
  }
}
