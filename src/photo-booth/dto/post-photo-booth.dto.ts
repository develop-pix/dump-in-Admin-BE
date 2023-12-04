import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  getCreateProps(): BrandCreateProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
    };
  }
}

export interface BrandCreateProps {
  name: string;
  isEvent: boolean;
  mainThumbnailImageUrl: string;
}
