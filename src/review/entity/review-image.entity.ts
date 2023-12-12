// review-image.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Review } from './review.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';

@Entity('review_image')
export class ReviewImage extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.reviewImages)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column({ name: 'review_image_url' })
  reviewImageUrl: string;
}
