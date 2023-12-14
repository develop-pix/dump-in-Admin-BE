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
import { BaseDateEntity } from '../../common/entity/common-date.entity';

@Entity('review')
export class Review extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column()
  date: Date;

  @Column({ name: 'frame_color' })
  frameColor: string;

  @Column()
  participants: number;

  @Column({ name: 'camera_shot' })
  cameraShot: string;

  @Column({ name: 'goods_amount', nullable: true })
  goodsAmount: boolean;

  @Column({ name: 'curl_amount', nullable: true })
  curlAmount: boolean;

  @Column({ name: 'is_public' })
  isPublic: boolean;

  @Column({ name: 'view_count' })
  viewCount: number;

  @Column({ name: 'like_count' })
  likeCount: number;

  @OneToMany(() => ReviewConcept, (reviewConcept) => reviewConcept.review)
  reviewConcepts: ReviewConcept[];

  @OneToMany(() => ReviewImage, (reviewImage) => reviewImage.review)
  reviewImages: ReviewImage[];

  @ManyToOne(() => PhotoBooth, (photoBooth: PhotoBooth) => photoBooth.reviews)
  @JoinColumn({ name: 'photo_booth_id' })
  photoBooth: PhotoBooth;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  static byId(id: number): Review {
    const review = new Review();

    review.id = id;

    return review;
  }

  static of({ boothName, nickname }: FindReviewOptionsProps): Review {
    const review = new Review();
    const user = User.byNickname(nickname);
    const booth = PhotoBooth.byName(boothName);

    review.user = nickname ? user : undefined;
    review.photoBooth = boothName ? booth : undefined;

    return review;
  }

  static delete(isDeleted: boolean): Review {
    const review = new Review();

    review.isDeleted = isDeleted;

    return review;
  }
}
