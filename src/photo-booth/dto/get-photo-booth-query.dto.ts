import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '../../common/dto/paginated-req.dto';

export interface QueryProps {
  name: string;
  location: string;
}

export class paginatedBoothQueryRequestDto extends PaginatedRequestDto {
  @ApiProperty({
    description: '포토부스에서 지역을 검색하는 쿼리스트링입니다',
    example: '서울',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  location?: string;

  @ApiProperty({
    description: '포토부스에서 지점명을 검색하는 쿼리스트링입니다',
    example: '하루필름 홍대 1호점',
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
