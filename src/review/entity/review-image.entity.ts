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

@Entity()
export class ReviewImage extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, (review) => review.review_images)
  @JoinColumn({ name: 'review_id' })
  review: Review;

  @Column()
  review_image_url: string;
}
