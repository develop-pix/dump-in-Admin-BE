import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationProps } from '../common/dto/pagination-req.dto';
import { FindReviewOptionsProps } from './dto/get-review-query.dto';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { PhotoBoothService } from '../photo-booth/photo-booth.service';
import { ReviewRepository } from './repository/review.repository';
import { Review } from './entity/review.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly photoBoothService: PhotoBoothService,
    private readonly userService: UserService,
  ) {}

  async findReviewByQueryParam(
    pageProps: PaginationProps,
    query: FindReviewOptionsProps,
  ): Promise<[GetReviewListDto[], number]> {
    /**
     * @param pageProps - pagination - 항목수, 페이지
     * @param query - request query string - 업체명, 유저 닉네임
     * @desc - 쿼리 파라미터에 맞는 리뷰 목록 조회
     *       - 쿼리 옵션이 없으면 전체 리뷰 조회
     */

    [query.photoBooth, query.user] = await Promise.all([
      this.photoBoothService.findOneOpenBoothByName(query.boothName),
      this.userService.findOneUserByNickname(query.userName),
    ]);

    const [results, count] =
      await this.reviewRepository.findReviewByOptionAndCount(
        Review.of(query),
        pageProps,
      );

    if (results.length === 0) {
      throw new NotFoundException('리뷰를 찾지 못했습니다');
    }

    return [
      results.map((result: Review) => new GetReviewListDto(result)),
      count,
    ];
  }

  async findOneReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOneReviewBy(Review.byId(id));

    if (!review) {
      throw new NotFoundException('이벤트를 찾지 못했습니다.');
    }

    return review;
  }

  async removeReview(id: number): Promise<boolean> {
    const isUpdated = await this.reviewRepository.updateReview(
      id,
      Review.delete(true),
    );

    if (!isUpdated) {
      throw new NotFoundException('리뷰 삭제가 불가능합니다.');
    }

    return true;
  }
}
