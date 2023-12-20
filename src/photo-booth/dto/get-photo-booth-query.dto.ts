import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import { PhotoBoothReqBodyProps } from './req-photo-booth-body.dto';

export class BoothQueryDto extends PaginationDto {
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

export class BoothBrandQueryDto extends PaginationDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: false,
    example: '포토그레이',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean;

  getQueryProps(): FindBrandOptionProps {
    return {
      name: this.decodeString(this.name),
      isEvent: this.isEvent,
    };
  }
}

export interface FindBrandOptionProps {
  name: string;
  isEvent: boolean;
}

export interface FindBoothOptionProps extends Partial<PhotoBoothReqBodyProps> {}
