import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventCreateProps } from './post-event.dto';

export class UpdateEventDto {
  @ApiProperty({
    description: '이벤트의 제목',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: '이벤트의 내용',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: '이벤트의 대표 이미지',
  })
  @IsString()
  @IsOptional()
  mainThumbnailUrl: string;

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @IsString()
  @IsOptional()
  brandName: string;

  @ApiProperty({
    description: '이벤트 공개 여부',
  })
  @IsBoolean()
  @IsOptional()
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

  getUpdateProps(): EventUpdateProps {
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

export interface EventUpdateProps extends Partial<EventCreateProps> {}
