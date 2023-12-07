import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationProps } from './pagination-req.dto';

export class Page<T> {
  @Exclude() private readonly _take: number;
  @Exclude() private readonly _count: number;
  @Exclude() private readonly _results: T[];
  @Exclude() private readonly _page: number;

  constructor(pageProps: PaginationProps, count: number, results: T[]) {
    this._page = pageProps.page;
    this._take = pageProps.take;
    this._count = count;
    this._results = results;
  }

  @ApiProperty({
    description: '페이지당 항목 수가 적용된 결과 데이터',
  })
  @Expose()
  get results(): T[] {
    return this._results;
  }

  @ApiProperty({
    description: '현재 페이지',
  })
  @Expose()
  get page(): number {
    return this._page;
  }

  @ApiProperty({
    description: '총 페이지 수',
  })
  @Expose()
  get totalPage(): number {
    return Math.ceil(this._count / this._take);
  }

  static create<T>(
    pageProps: PaginationProps,
    count: number,
    results: T[],
  ): Page<T> {
    return new Page<T>(pageProps, count, results);
  }
}
