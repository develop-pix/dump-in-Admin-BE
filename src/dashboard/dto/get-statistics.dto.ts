import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Statistics {
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

  static compare(a: RawCountByDate, b: RawCountByDate): number {
    return b.created.getTime() - a.created.getTime();
  }

  static mergeResults(results: RawCountByDate[]): RawCountByDate[] {
    const mergedResults: { [date: string]: RawCountByDate } = {};

    const mergeResult = (result: RawCountByDate): void => {
      const date = result.created.toISOString();
      const existingResult = mergedResults[date] || {
        created: new Date(date),
        user: 0,
        review: 0,
      };

      existingResult.review += result.review || 0;
      existingResult.user += result.user || 0;

      mergedResults[date] = existingResult;
    };

    results.forEach(mergeResult);

    return Object.values(mergedResults);
  }

  static list(response: RawCountByDate[]): Statistics[] {
    return response.map((item) => new this(item));
  }
}

export interface RawCountByDate {
  created: Date;
  user: number;
  review: number;
}
