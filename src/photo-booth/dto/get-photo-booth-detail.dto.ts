import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothRawData } from '../entity/raw-data.entity';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

export class GetPhotoBoothDetailDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _location: string;
  @Exclude() private readonly _latitude: number;
  @Exclude() private readonly _longitude: number;
  @Exclude() private readonly _street_address?: string | null;
  @Exclude() private readonly _road_address?: string | null;
  @Exclude() private readonly _operation_time?: string | null;
  @Exclude()
  @Type(() => PhotoBoothBrand)
  private readonly _photo_booth_brand: PhotoBoothBrand | undefined;

  constructor(data: PhotoBooth | PhotoBoothRawData) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '포토부스의 고유한 uuid 값' })
  @Expose()
  get id(): string {
    return this._id;
  }

  @ApiProperty({
    description: '포토부스의 업체 + 지점명',
    example: '하루필름 홍대 1호점',
  })
  @Expose()
  get name(): string {
    return this._name;
  }

  @ApiProperty({
    description: '포토부스의 지역',
    example: '서울',
  })
  @Expose()
  get location(): string {
    return this._location;
  }

  @ApiProperty({
    description: '포토부스 지점의 위도',
    example: 37.566295,
  })
  @Expose()
  get latitude(): number {
    return this._latitude;
  }

  @ApiProperty({
    description: '포토부스 지점의 경도',
    example: 126.977945,
  })
  @Expose()
  get longitude(): number {
    return this._longitude;
  }

  @ApiProperty({
    description: '포토부스의 지번 주소',
  })
  @Expose()
  get street_address(): string | null {
    return this._street_address;
  }

  @ApiProperty({
    description: '포토부스의 도로명 주소',
  })
  @Expose()
  get road_address(): string | null {
    return this._road_address;
  }

  @ApiProperty({
    description: '포토부스의 운영 시간',
  })
  @Expose()
  get operation_time(): string | null {
    return this._operation_time;
  }

  @ApiProperty({
    description: '포토부스 업체명',
  })
  @Expose()
  @Type(() => PhotoBoothBrand)
  get brandName(): string | null {
    return this._photo_booth_brand.name;
  }
}
