import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatisticsDto {
  @Exclude() readonly _created: Date;
  @Exclude() readonly _review: string;
  @Exclude() readonly _user: string;

  constructor(data: RawCountByDate) {
    Object.keys(data).map((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '일자' })
  @Expose()
  get date(): Date {
    return this._created;
  }

  @ApiProperty({
    description: '날짜별 가입자 수',
  })
  @Expose()
  get userCount(): number {
    return parseInt(this._user);
  }

  @ApiProperty({
    description: '날짜별 리뷰 수',
  })
  @Expose()
  get reviewCount(): number {
    return parseInt(this._review);
  }
}

export interface RawCountByDate {
  created: string;
  user: string;
  review: string;
}
