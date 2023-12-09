import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReviewImage } from './review-image.entity';
import { ReviewConcept } from './review-concept.entity';
import { User } from '../../user/entity/user.entity';
import { PhotoBooth } from '../../photo-booth/entity/photo-booth.entity';
import { FindReviewOptionsProps } from '../dto/get-review-query.dto';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  is_deleted: boolean;

  @Column()
  date: Date;

  @Column()
  frame_color: string;

  @Column()
  participants: number;

  @Column()
  camera_shot: string;

  @Column({ nullable: true })
  goods_amount: boolean;

  @Column({ nullable: true })
  curl_amount: boolean;

  @Column()
  is_public: boolean;

  @Column()
  view_count: number;

  @Column()
  likes_count: number;

  @OneToMany(() => ReviewConcept, (reviewConcept) => reviewConcept.review)
  review_concepts: ReviewConcept[];

  @OneToMany(() => ReviewImage, (reviewImage) => reviewImage.review)
  review_images: ReviewImage[];

  @ManyToOne(() => PhotoBooth, (photoBooth: PhotoBooth) => photoBooth.reviews)
  @JoinColumn({ name: 'photo_booth_id' })
  photo_booth: PhotoBooth;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static byId(id: number): Review {
    const review = new Review();

    review.id = id;

    return review;
  }

  static of({ photoBooth, user }: FindReviewOptionsProps): Review {
    const review = new Review();

    review.photo_booth = photoBooth;
    review.user = user;

    return review;
  }

  static delete(isDeleted: boolean): Review {
    const review = new Review();

    review.is_deleted = isDeleted;

    return review;
  }
}
