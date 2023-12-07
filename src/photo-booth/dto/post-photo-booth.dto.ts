import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoothBrandDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: true,
    example: '포토그레이',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '포토부스 업체 대표사진 URL',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  mainThumbnailImageUrl: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEvent: boolean = false;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags?: string[];

  getCreateProps(): BrandCreateProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      hashtags: (this.hashtags || []).filter((tag) => tag.trim() !== ''),
    };
  }
}

export interface BrandCreateProps {
  name: string;
  isEvent: boolean;
  mainThumbnailImageUrl: string;
  hashtags?: string[];
}
