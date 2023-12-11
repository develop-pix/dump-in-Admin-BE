import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';
import { Type } from 'class-transformer';

export interface EventReqBodyProps {
  title: string;
  content: string;
  mainThumbnailUrl: string;
  brandName: string;
  isPublic: boolean;
  startDate: Date;
  endDate: Date;
  brand?: PhotoBoothBrand;
  hashtags?: string[];
}

export class EventReqBodyDto implements EventReqBodyProps {
  @ApiProperty({
    description: '이벤트의 제목',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  title: string;

  @ApiProperty({
    description: '이벤트의 내용',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  @Type(() => String)
  content: string;

  @ApiProperty({
    description: '이벤트의 대표 이미지',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @Type(() => String)
  mainThumbnailUrl: string;

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  brandName: string;

  @ApiProperty({
    description: '이벤트 공개 여부',
  })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: '이벤트 시작일',
  })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: '이벤트 마감일',
  })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 5개)',
    example: ['캐릭터', '콜라보', '연예인', '스냅', '이달의프레임'],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(5, { message: '해시태그는 최대 5개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags: string[];
}
