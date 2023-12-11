import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

export interface PhotoBoothReqBodyProps {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  brandName: string;
  roadAddress: string;
  streetAddress: string;
  operationTime: string;
  brand?: PhotoBoothBrand;
}

export class PhotoBoothReqBodyDto implements PhotoBoothReqBodyProps {
  description: string;
  photoBoothUrl: string;
  brand?: PhotoBoothBrand;
  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  location: string;

  @ApiProperty({
    description: '포토부스 지점의 위도',
    example: 37.566295,
  })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: '포토부스 지점의 경도',
    example: 126.977945,
  })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  streetAddress: string;

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  roadAddress: string;

  @ApiProperty({
    description: '포토부스의 운영 시간',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  operationTime: string;

  @ApiProperty({
    description: '포토부스 업체명',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  brandName: string;
}

export interface BrandReqBodyProps {
  name: string;
  isEvent: boolean;
  mainThumbnailImageUrl: string;
  hashtags: string[];
  description: string;
  photoBoothUrl: string;
}

export class BrandReqBodyDto implements BrandReqBodyProps {
  @ApiProperty({
    description: '포토부스 업체명',
    required: true,
    example: '포토그레이',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '포토부스 업체 대표사진 URL',
    required: true,
  })
  @IsString()
  mainThumbnailImageUrl: string;

  @ApiProperty({
    description: '포토부스의 업체 설명',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: '포토부스의 업체 관련 홈페이지 주소',
  })
  @IsString()
  photoBoothUrl: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    example: true,
  })
  @IsBoolean()
  isEvent: boolean = false;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags: string[];
}
