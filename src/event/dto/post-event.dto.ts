import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PhotoBoothBrand } from 'src/photo-booth/entity/photo-booth-brand.entity';

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트의 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '이벤트의 내용',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '이벤트의 대표 이미지',
  })
  @IsString()
  @IsNotEmpty()
  mainThumbnailUrl: string;

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({
    description: '이벤트 공개 여부',
  })
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty({
    description: '포토부스 업체 해시태그 목록 (최대 4개)',
    example: ['캐릭터', '콜라보', '연예인', '스냅', '이달의프레임'],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(5, { message: '해시태그는 최대 5개까지 입력 가능합니다.' })
  @IsString({ each: true })
  hashtags: string[];

  getCreateProps(): EventCreateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
      hashtags: (this.hashtags || []).filter((tag) => tag.trim() !== ''),
    };
  }
}

export interface EventCreateProps {
  title: string;
  content: string;
  mainThumbnailUrl: string;
  brandName: string;
  isPublic: boolean;
  brand?: PhotoBoothBrand;
  hashtags?: string[];
}
