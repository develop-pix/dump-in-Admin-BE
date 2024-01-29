import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventImage } from '../entity/event-image.entity';
import { PhotoBoothBrand } from '../../brand/entity/brand.entity';
import { EventReqBodyProps, ToEventProps } from '../event.interface';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';

export class EventReqBody implements EventReqBodyProps {
  @ApiProperty({
    description: '이벤트의 제목',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: '이벤트의 내용',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(512)
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: '이벤트의 대표 이미지',
  })
  @MinLength(2)
  @MaxLength(256)
  @IsUrl()
  mainThumbnailUrl: string;

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  brandName: string;

  @ApiProperty({
    description: '이벤트 공개 여부',
    example: 'true',
  })
  @IsBoolean()
  @Type(() => Boolean)
  isPublic: boolean;

  @ApiProperty({
    description: '이벤트 시작일',
    example: '2024-01-01',
  })
  @IsString()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: '이벤트 마감일',
    example: '2024-01-31',
  })
  @IsString()
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 5개)',
    example: ['캐릭터', '콜라보', '연예인', '스냅', '이달의프레임'],
  })
  @IsArray()
  @ArrayMaxSize(5, { message: '해시태그는 최대 5개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags: string[];

  @ApiProperty({
    description: '포토부스 업체 이미지 URL (최대 4개)',
    example: ['url', 'url2', 'url3', 'url4'],
  })
  @IsArray()
  @ArrayMaxSize(4, { message: '이미지 최대 4개까지 입력 가능합니다.' })
  @IsUrl({}, { each: true })
  images: string[];

  toEntity(): ToEventProps {
    const hashtags = Hashtag.unique(this.hashtags);
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: PhotoBoothBrand.byName(this.brandName),
      isPublic: this.isPublic,
      startDate: this.startDate,
      endDate: this.endDate,
      eventImages: this.images.map((image) => EventImage.create(image)),
      hashtags,
    };
  }
}
