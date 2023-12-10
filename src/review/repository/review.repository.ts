import {
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationProps } from '../../common/dto/pagination-req.dto';
import { Review } from '../entity/review.entity';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  async findReviewByOptionAndCount(
    review: Review,
    page: PaginationProps,
  ): Promise<[Review[], number]> {
    const options = this.findReviewManyOptions(page, review);
    return await this.findAndCount(options);
  }

  async findOneReviewBy(review: Review): Promise<Review> {
    const where = this.findReviewOptionsWhere(review);
    return await this.findOneBy(where);
  }

  async updateReview(id: number, review: Review): Promise<boolean> {
    const result = await this.update(id, review);
    return result.affected > 0;
  }

  private findReviewManyOptions(
    page: PaginationProps,
    review: Review,
  ): FindManyOptions<Review> {
    const { take, skip } = page;
    const where = this.findReviewOptionsWhere(review);
    const relations = {
      review_concepts: true,
      review_images: true,
      photo_booth: true,
      user: true,
    };
    const select: FindOptionsSelect<Review> = {
      id: true,
      content: true,
      date: true,
    };
    return { where, relations, take, skip, select };
  }

  private findReviewOptionsWhere(review: Review): FindOptionsWhere<Review> {
    return {
      id: review.id,
      photo_booth: review.photo_booth,
      user: review.user,
      is_deleted: false,
    };
  }
}
