import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PhotoBoothUpdateProps } from '../entity/photo-booth.entity';

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
      street_address: this.streetAddress,
      road_address: this.roadAddress,
    };
  }
}
