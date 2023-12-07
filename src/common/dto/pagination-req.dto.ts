import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export interface PaginationProps {
  take: number;
  skip: number;
  page: number;
}

export class PaginationDto {
  @ApiProperty({
    description: '리스트에 요구할 페이지 숫자',
    required: false,
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  @Expose()
  page?: number = 1;

  @ApiProperty({
    description: '리스트에 요구할 페이지당 항목 수',
    required: false,
    example: 20,
    default: 10,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @Expose()
  perPage?: number = 10;

  get skip(): number {
    return this.page < 0 ? 0 : (this.page - 1) * this.perPage;
  }

  get take(): number {
    return this.perPage;
  }

  getPageProps(): PaginationProps {
    return {
      take: this.take,
      skip: this.skip,
      page: this.page,
    };
  }
}
