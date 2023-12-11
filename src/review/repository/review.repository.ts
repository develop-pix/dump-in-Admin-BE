import {
  DataSource,
  FindManyOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationProps } from '../../common/dto/get-pagination-query.dto';
import { Review } from '../entity/review.entity';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(Review);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner,
    );
  }

  async findReviewByOptionAndCount(
    review: Review,
    page: PaginationProps,
  ): Promise<[Review[], number]> {
    const options = this.findReviewManyOptions(review, page);
    return await this.findAndCount(options);
  }

  async findOneReview(review: Review): Promise<Review> {
    const options = this.findReviewManyOptions(review);
    return await this.findOne(options);
  }

  async updateReview(id: number, review: Review): Promise<boolean> {
    const result = await this.update(id, review);
    return result.affected > 0;
  }

  private findReviewManyOptions(
    review: Review,
    page?: PaginationProps,
  ): FindManyOptions<Review> {
    const { take, skip } = page || { take: undefined, skip: undefined };
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
      view_count: true,
      like_count: true,
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
