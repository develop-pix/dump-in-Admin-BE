import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePhotoBoothDto {
  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @Expose()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @Expose()
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @Expose()
  @IsString()
  @IsOptional()
  roadAddress?: string;

  getUpdateProps(): PhotoBoothUpdateProps {
    return {
      name: this.name,
      location: this.location,
      streetAddress: this.streetAddress,
      roadAddress: this.roadAddress,
      isDelete: false,
    };
  }
}

export class UpdateBoothBrandDto {
  @ApiProperty({
    description: '포토부스의 업체명',
    example: '하루필름',
  })
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '포토부스의 업체 설명',
  })
  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '포토부스의 업체 관련 홈페이지 주소',
  })
  @Expose()
  @IsString()
  @IsOptional()
  photoBoothUrl?: string;

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
    example: true,
  })
  @Expose()
  @IsBoolean()
  @IsOptional()
  isEvent?: boolean;

  @ApiProperty({
    description: '포토부스의 대표 이미지',
  })
  @Expose()
  mainThumbnailImageUrl?: string;

  getUpdateProps(): BrandUpdateProps {
    return {
      name: this.name,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      isEvent: this.isEvent,
    };
  }
}

export interface BrandUpdateProps {
  name: string;
  description: string;
  photoBoothUrl: string;
  mainThumbnailImageUrl: string;
  isEvent: boolean;
}

export interface PhotoBoothUpdateProps {
  name: string;
  location: string;
  streetAddress: string;
  roadAddress: string;
  isDelete: boolean;
}
