import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import { FindBoothOptionProps } from '../photo-booth.interface';

export class BoothQueryParam extends PaginationDto {
  @ApiProperty({
    description: '포토부스에서 지역을 검색하는 쿼리스트링',
    required: false,
    example: '서울',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  location: string;

  @ApiProperty({
    description: '포토부스에서 지점명을 검색하는 쿼리스트링',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스에서 업체명을 검색하는 쿼리스트링',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  brandName: string;

  getQueryProps(): FindBoothOptionProps {
    return {
      location: this.location,
      name: this.name,
      brandName: this.brandName,
    };
  }
}
