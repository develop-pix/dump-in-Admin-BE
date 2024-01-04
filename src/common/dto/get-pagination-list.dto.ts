import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationProps } from './get-pagination-query.dto';

export class PageEntity<T> {
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

  @ApiProperty({
    description: '쿼리 결과 항목 수 (전체)',
  })
  @Expose()
  get queryCount(): number {
    return this._count;
  }

  @ApiProperty({
    description: '현재 페이지의 항목 수',
  })
  @Expose()
  get resultsLength(): number {
    return this._results.length;
  }

  static create<T>(
    pageProps: PaginationProps,
    count: number,
    response: T[],
  ): PageEntity<T> {
    return new PageEntity<T>(pageProps, count, response);
  }
}
