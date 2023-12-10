import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewConcept } from '../entity/review-concept.entity';
import { PhotoBooth } from '../../photo-booth/entity/photo-booth.entity';
import { User } from '../../user/entity/user.entity';
import { ReviewImage } from '../entity/review-image.entity';
import { Review } from '../entity/review.entity';

export class GetReviewListDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _content: string;
  @Exclude() private readonly _date: Date;
  @Exclude()
  @Type(() => ReviewConcept)
  private readonly _review_concepts: ReviewConcept[];
  @Exclude()
  @Type(() => ReviewImage)
  private readonly _review_images: ReviewImage[];
  @Exclude()
  @Type(() => PhotoBooth)
  private readonly _photo_booth: PhotoBooth;
  @Exclude()
  @Type(() => User)
  private readonly _user: User;

  constructor(data: Review) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '리뷰의 id 값' })
  @Expose()
  get id(): number {
    return this._id;
  }
  @ApiProperty({
    description: '리뷰의 내용',
  })
  @Expose()
  get content(): string {
    return this._content;
  }

  @ApiProperty({
    description: '리뷰의 대표 이미지',
  })
  @Expose()
  get date(): Date {
    return this._date;
  }

  @ApiProperty({
    description: '리뷰의 컨셉',
  })
  @Expose()
  get reviewConcept(): ReviewConcept[] {
    return this._review_concepts;
  }

  @ApiProperty({
    description: '리뷰에 작성된 이미지들',
  })
  @Expose()
  get reviewImages(): ReviewImage[] {
    return this._review_images;
  }

  @ApiProperty({
    description: '리뷰에 연결된 포토부스 정보',
  })
  @Expose()
  get boothName(): string {
    return this._photo_booth.name;
  }

  @ApiProperty({
    description: '리뷰를 작성한 유저 정보',
  })
  @Expose()
  get userName(): string {
    return this._user.nickname;
  }
}
