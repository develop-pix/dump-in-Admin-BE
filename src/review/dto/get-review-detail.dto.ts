import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetReviewListDto } from './get-review-list.dto';

export class GetReviewDetailDto extends GetReviewListDto {
  @ApiProperty({
    description: '리뷰의 조회수',
  })
  @Expose()
  get viewCount(): number {
    return this._view_count;
  }

  @ApiProperty({
    description: '리뷰의 좋아요수',
  })
  @Expose()
  get likesCount(): number {
    return this._likes_count;
  }

  @ApiProperty({
    description: '리뷰의 공개 여부',
  })
  @Expose()
  get isPublic(): boolean {
    return this._is_public;
  }
}
