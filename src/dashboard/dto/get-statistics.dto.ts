import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatisticsDto {
  @Exclude() readonly _created: Date;
  @Exclude() readonly _review: number;
  @Exclude() readonly _user: number;

  constructor(data: RawCountByDate) {
    Object.keys(data).map((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '일자' })
  @Expose()
  @Type(() => Date)
  get date(): Date {
    return this._created;
  }

  @ApiProperty({
    description: '날짜별 가입자 수',
  })
  @Expose()
  @Type(() => Number)
  get user(): number {
    return this._user;
  }

  @ApiProperty({
    description: '날짜별 리뷰 수',
  })
  @Expose()
  @Type(() => Number)
  get review(): number {
    return this._review;
  }
}

export interface RawCountByDate {
  created: Date;
  user: number;
  review: number;
}
