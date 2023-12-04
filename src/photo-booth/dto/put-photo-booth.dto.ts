import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

export class MoveHiddenToOpenBoothDto {
  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: '포토부스 지점의 위도',
    example: 37.566295,
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: '포토부스 지점의 경도',
    example: 126.977945,
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @IsString()
  @IsNotEmpty()
  streetAddress?: string;

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @IsString()
  @IsNotEmpty()
  roadAddress?: string;

  @ApiProperty({
    description: '포토부스의 운영 시간',
  })
  @IsString()
  @IsNotEmpty()
  operationTime: string;

  @ApiProperty({
    description: '포토부스 업체명',
  })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  getUpdateProps(): MoveToOpenBoothProps {
    return {
      name: this.name,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      brandName: this.brandName,
      roadAddress: this.roadAddress,
      streetAddress: this.streetAddress,
      operationTime: this.operationTime,
    };
  }
}

export interface MoveToOpenBoothProps {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  brandName?: string;
  roadAddress: string;
  streetAddress: string;
  operationTime: string;
  photoBoothBrand?: PhotoBoothBrand;
}
