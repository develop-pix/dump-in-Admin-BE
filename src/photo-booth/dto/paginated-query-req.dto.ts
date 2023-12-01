import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export interface PaginatedProps {
  take: number;
  skip: number;
  page: number;
}

export interface QueryProps {
  name: string;
  location: string;
}

export class PaginatedRequestDto {
  @ApiProperty({
    description: '리스트에 요구할 페이지 숫자입니다',
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
    description: '리스트에 요구할 페이지당 항목 수 입니다',
    example: 20,
    default: 10,
  })
  @IsInt()
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

  getPageProps(): PaginatedProps {
    return {
      take: this.take,
      skip: this.skip,
      page: this.page,
    };
  }
}

export class paginatedBoothQueryRequestDto extends PaginatedRequestDto {
  @ApiProperty({
    description: '포토부스에서 지역을 검색하는 쿼리스트링입니다',
    example: "서울",
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  location?: string;

  @ApiProperty({
    description: '포토부스에서 지점명을 검색하는 쿼리스트링입니다',
    example: "하루필름 홍대 1호점",
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name?: string;

  getQueryProps(): QueryProps {
    return {
      location: this.location,
      name: this.name,
    };
  }
}
