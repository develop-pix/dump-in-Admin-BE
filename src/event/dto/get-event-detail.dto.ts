import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetEventListDto } from './get-event-list.dto';

export class GetEventDetailDto extends GetEventListDto {
  @ApiProperty({
    description: '이벤트 시작일',
  })
  @Expose()
  get startDate(): Date {
    return this._startDate;
  }

  @ApiProperty({
    description: '이벤트 마감일',
  })
  @Expose()
  get endDate(): Date {
    return this._endDate;
  }

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
}
