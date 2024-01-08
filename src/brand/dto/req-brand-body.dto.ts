import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BrandImage } from '../../brand/entity/brand-image.entity';
import { BrandReqBodyProps, ToBrandProps } from '../brand.interface';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';

export class BrandReqBody implements BrandReqBodyProps {
  @ApiProperty({
    description: '포토부스 업체명',
    required: true,
    example: '포토그레이',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  name: string;

  @ApiProperty({
    description: '포토부스 업체 대표사진 URL',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(512)
  mainThumbnailImageUrl: string;

  @ApiProperty({
    description: '포토부스의 업체 설명',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  description: string;

  @ApiProperty({
    description: '포토부스의 업체 관련 홈페이지 주소',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(128)
  photoBoothUrl: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags: string[];

  @ApiProperty({
    description: '포토부스 업체 이미지 URL (최대 4개)',
    example: ['url', 'url2', 'url3', 'url4'],
  })
  @IsArray()
  @ArrayMaxSize(4, { message: '해시태그는 최대 4개까지 입력 가능합니다.' })
  @IsUrl({}, { each: true })
  images: string[];

  toEntity(): ToBrandProps {
    const hashtags = Hashtag.unique(this.hashtags);
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      images: this.images.map((image) => BrandImage.create(image)),
      hashtags,
    };
  }
}
