import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

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

  toEntity(): PhotoBoothBrand {
    const brandCreateProps: BrandCreateProps = {
      name: this.name,
      main_thumbnail_image_url: this.mainThumbnailImageUrl,
      is_event: this.isEvent,
    };

    return PhotoBoothBrand.create(brandCreateProps);
  }
}

export interface BrandCreateProps {
  name: string;
  main_thumbnail_image_url: string;
  is_event: boolean;
}
