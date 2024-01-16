import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetEventList } from './get-event-list.dto';

export class GetEventDetail extends GetEventList {
  @ApiProperty({
    description: '이벤트의 조회수',
  })
  @Expose()
  get viewCount(): number {
    return this._viewCount;
  }

  @ApiProperty({
    description: '이벤트의 좋아요수',
  })
  @Expose()
  get likesCount(): number {
    return this._likeCount;
  }

  @ApiProperty({
    description: '이벤트의 공개 여부',
  })
  @Expose()
  get isPublic(): boolean {
    return this._isPublic;
  }

  @ApiProperty({
    description: '이벤트 이미지 url',
  })
  @Expose()
  get images(): string[] {
    return this._eventImages.map((images) => images.eventImageUrl);
  }
}
