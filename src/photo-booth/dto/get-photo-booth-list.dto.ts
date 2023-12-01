import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothRawData } from '../entity/raw-data.entity';
import { PhotoBooth } from '../entity/photo-booth.entity';

export class GetPhotoBoothListDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _latitude: number;
  @Exclude() private readonly _longitude: number;
  @Exclude() private readonly _street_address?: string | null;
  @Exclude() private readonly _road_address?: string | null;

  constructor(data: PhotoBooth | PhotoBoothRawData) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '포토부스의 고유한 uuid 값 입니다' })
  @Expose()
  get id(): string {
    return this._id;
  }

  @ApiProperty({
    description: '포토부스의 업체 + 지점명 입니다',
    example: '하루필름 홍대 1호점',
  })
  @Expose()
  get name(): string {
    return this._name;
  }

  @ApiProperty({
    description: '포토부스 지점의 위도입니다',
    example: 37.566295,
  })
  @Expose()
  get latitude(): number {
    return this._latitude;
  }

  @ApiProperty({
    description: '포토부스 지점의 경도입니다',
    example: 126.977945,
  })
  @Expose()
  get longitude(): number {
    return this._longitude;
  }

  @ApiProperty({
    description: '포토부스의 지번 주소 입니다',
  })
  @Expose()
  get street_address(): string | null {
    return this._street_address;
  }

  @ApiProperty({
    description: '포토부스의 도로명 주소 입니다',
  })
  @Expose()
  get road_address(): string | null {
    return this._road_address;
  }
}
