import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export interface PaginationProps {
  take: number;
  skip: number;
  page: number;
}

export class PaginationDto implements PaginationProps {
  @ApiProperty({
    description: '리스트에 요구할 페이지 숫자',
    required: true,
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  @Expose()
  page: number;

  @ApiProperty({
    description: '리스트에 요구할 페이지당 항목 수',
    required: true,
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  perPage: number;

  get skip(): number {
    return this.page < 0 ? 0 : (this.page - 1) * (this.perPage ?? 10);
  }

  get take(): number {
    return this.perPage || 10;
  }

  getPageProps(): PaginationProps {
    return {
      take: this.take,
      skip: this.skip,
      page: this.page,
    };
  }

  decodeString(encodedString: string): string {
    if (typeof encodedString === 'undefined') return undefined;
    return decodeURIComponent(encodedString);
  }
}
