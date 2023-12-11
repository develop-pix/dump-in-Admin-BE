import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { PhotoBooth } from '../entity/photo-booth.entity';
import { HiddenPhotoBooth } from '../entity/photo-booth-hidden.entity';

export class GetPhotoBoothListDto {
  @Exclude() readonly _id: string;
  @Exclude() readonly _name: string;
  @Exclude() readonly _location: string;
  @Exclude() readonly _latitude: number;
  @Exclude() readonly _longitude: number;
  @Exclude() readonly _created_at: Date;
  @Exclude() readonly _updated_at: Date;
  @Exclude() readonly _like_count: number | undefined;
  @Exclude() readonly _view_count: number | undefined;
  @Exclude() readonly _street_address?: string | null;
  @Exclude() readonly _road_address?: string | null;
  @Exclude() readonly _operation_time?: string | null;
  @Type(() => PhotoBoothBrand)
  @Exclude()
  readonly _photo_booth_brand: PhotoBoothBrand | undefined;

  constructor(data: PhotoBooth | HiddenPhotoBooth) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '포토부스의 고유한 uuid 값', example: 'uuid' })
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
    description: '포토부스의 지번 주소',
    example: '지번 주소',
  })
  @Expose()
  get streetAddress(): string | null {
    return this._street_address;
  }

  @ApiProperty({
    description: '포토부스의 도로명 주소',
    example: '도로명 주소',
  })
  @Expose()
  get roadAddress(): string | null {
    return this._road_address;
  }

  @ApiProperty({
    description: '포토부스 업체명',
    example: '업체명',
  })
  @Expose()
  @Type(() => PhotoBoothBrand)
  get brandName(): PhotoBoothBrand {
    return this._photo_booth_brand;
  }
}

export class GetBoothBrandListDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _name: string;
  @Exclude() readonly _main_thumbnail_image_url?: string | null;
  @Exclude() readonly _description?: string | null;
  @Exclude() readonly _photo_booth_url?: string | null;
  @Exclude() readonly _is_event: boolean;
  @Exclude()
  @Type(() => BrandHashtag)
  readonly _photo_booth_hashtags: BrandHashtag[] | null;

  constructor(data: PhotoBoothBrand) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '포토부스 업체의 id 값' })
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty({
    description: '포토부스의 업체명',
    example: '하루필름',
  })
  @Expose()
  get name(): string {
    return this._name;
  }

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
    example: true,
  })
  @Expose()
  get isEvent(): boolean {
    return this._is_event;
  }

  @ApiProperty({
    description: '포토부스의 대표 이미지',
  })
  @Expose()
  get mainThumbnailImageUrl(): string | null {
    return this._main_thumbnail_image_url;
  }

  @ApiProperty({
    description: '포토부스의 해시태그',
  })
  @Expose()
  get hashtags(): BrandHashtag[] {
    return this._photo_booth_hashtags;
  }
}
