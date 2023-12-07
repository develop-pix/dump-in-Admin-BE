import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePhotoBoothDto {
  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @IsString()
  @IsOptional()
  roadAddress?: string;

  getUpdateProps(): PhotoBoothUpdateProps {
    return {
      name: this.name,
      location: this.location,
      streetAddress: this.streetAddress,
      roadAddress: this.roadAddress,
      isDelete: false,
    };
  }
}

export class UpdateBoothBrandDto {
  @ApiProperty({
    description: '포토부스의 업체명',
    example: '하루필름',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '포토부스의 업체 설명',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '포토부스의 업체 관련 홈페이지 주소',
  })
  @IsString()
  @IsOptional()
  photoBoothUrl?: string;

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isEvent?: boolean;

  @ApiProperty({
    description: '포토부스의 대표 이미지',
  })
  @IsString()
  @IsOptional()
  mainThumbnailImageUrl?: string;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags?: string[];

  getUpdateProps(): BrandUpdateProps {
    return {
      name: this.name,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      isEvent: this.isEvent,
      hashtags: this.hashtags,
    };
  }
}

export interface BrandUpdateProps {
  name: string;
  description: string;
  photoBoothUrl: string;
  mainThumbnailImageUrl: string;
  isEvent: boolean;
  hashtags: string[];
}

export interface PhotoBoothUpdateProps extends Partial<MoveToOpenBoothProps> {
  isDelete: boolean;
}
