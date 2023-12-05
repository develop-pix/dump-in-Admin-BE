import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: true,
    example: '포토그레이',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '포토부스 업체 대표사진 URL',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  mainThumbnailImageUrl: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    example: true,
  })
  @Expose()
  @IsOptional()
  @IsBoolean()
  isEvent: boolean = false;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @Expose()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags?: string[];

  getCreateProps(): BrandCreateProps {
    const cleanedHashtags = (this.hashtags || []).filter(
      (tag) => tag.trim() !== '',
    );

    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      hashtags: cleanedHashtags,
    };
  }
}

export interface BrandCreateProps {
  name: string;
  isEvent: boolean;
  mainThumbnailImageUrl: string;
  hashtags?: string[];
}
