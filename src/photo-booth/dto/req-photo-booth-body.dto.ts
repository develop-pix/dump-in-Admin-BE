import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { PhotoBoothReqBodyProps, ToBoothProps } from '../photo-booth.interface';

export class PhotoBoothReqBodyDto implements PhotoBoothReqBodyProps {
  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  location: string;

  @ApiProperty({
    description: '포토부스 지점의 위도',
    example: 37.566295,
  })
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: '포토부스 지점의 경도',
    example: 126.977945,
  })
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  streetAddress: string;

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  roadAddress: string;

  @ApiProperty({
    description: '포토부스의 운영 시간',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  operationTime: string;

  @ApiProperty({
    description: '포토부스 업체명',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  brandName: string;

  toEntity(): ToBoothProps {
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
