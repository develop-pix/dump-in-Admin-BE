import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
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

  getUpdateProps(): EventUpdateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
    };
  }
}

export interface EventUpdateProps extends Partial<EventCreateProps> {}
