import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class Page<T> {
  @Exclude() private readonly take: number;
  @Exclude() private readonly count: number;

  constructor(page: number, take: number, count: number, results: T[]) {
    this.page = page;
    this.take = take;
    this.count = count;
    this.results = results;
  }

  @ApiProperty({
    description: '페이지당 항목 수가 적용된 결과 데이터 입니다',
  })
  @Expose()
  public results: T[];

  @ApiProperty({
    description: '현재 페이지 입니다',
  })
  @Expose()
  public page: number;

  @ApiProperty({
    description: '총 페이지 수 입니다',
  })
  @Expose()
  get totalPage(): number {
    return Math.ceil(this.count / this.take);
  }
}
