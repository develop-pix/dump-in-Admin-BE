import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import {
  BrandReqBodyProps,
  PhotoBoothReqBodyProps,
} from './req-photo-booth-body.dto';

export class BoothQueryDto extends PaginationDto {
  @ApiProperty({
    description: '포토부스에서 지역을 검색하는 쿼리스트링',
    required: false,
    example: '서울',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  location: string;

  @ApiProperty({
    description: '포토부스에서 지점명을 검색하는 쿼리스트링',
    required: false,
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스에서 업체명을 검색하는 쿼리스트링',
    required: false,
    example: '하루필름',
  })
  @IsString()
  @MinLength(3)
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
  @MinLength(3)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean;

  @ApiProperty({
    description: '포토부스 업체의 해시태그',
    required: false,
    example: '카페,스튜디오,이벤트',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  @Type(() => String)
  hashtags: string;

  getQueryProps(): FindBrandOptionProps {
    return {
      name: this.decodeString(this.name),
      isEvent: this.isEvent,
      hashtags: this.decodeString(this.hashtags)
        ?.split(',')
        .map((tag) => tag.trim()),
    };
  }
}

export interface FindBrandOptionProps extends Partial<BrandReqBodyProps> {}

export interface FindBoothOptionProps extends Partial<PhotoBoothReqBodyProps> {}
