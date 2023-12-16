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
import { RawCountByDate } from '../../dashboard/dto/get-statistics.dto';

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
    const { take, skip } = page;
    const options = this.findReviewManyOptions(review);
    return await this.findAndCount({ take, skip, ...options });
  }

  async findOneReview(review: Review): Promise<Review> {
    const options = this.findReviewManyOptions(review);
    return await this.findOne(options);
  }

  async updateReview(id: number, review: Review): Promise<boolean> {
    const result = await this.update(id, review);
    return result.affected > 0;
  }

  async countReviewsByDate(): Promise<RawCountByDate[]> {
    const queryResult = await this.createQueryBuilder('review')
      .select(['DATE(created_at) as created', 'COUNT(id) as review'])
      .groupBy('created')
      .orderBy('created', 'DESC')
      .getRawMany();

    return queryResult;
  }

  private findReviewManyOptions(review: Review): FindManyOptions<Review> {
    const where = this.findReviewOptionsWhere(review);
    const relations = {
      reviewConcepts: true,
      reviewImages: true,
      photoBooth: true,
      user: true,
    };
    const select: FindOptionsSelect<Review> = {
      id: true,
      content: true,
      date: true,
      viewCount: true,
      likeCount: true,
    };
    return { where, relations, select };
  }

  private findReviewOptionsWhere(review: Review): FindOptionsWhere<Review> {
    return {
      id: review.id,
      photoBooth: review.photoBooth,
      user: review.user,
      isDeleted: false,
    };
  }
}
