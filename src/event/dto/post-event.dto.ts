import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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

  getCreateProps(): EventCreateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
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
}
