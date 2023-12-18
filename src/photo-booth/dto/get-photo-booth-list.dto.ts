import { Exclude, Expose } from 'class-transformer';
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
  @Exclude() readonly _createdAt: Date;
  @Exclude() readonly _updatedAt: Date;
  @Exclude() readonly _likeCount: number;
  @Exclude() readonly _viewCount: number;
  @Exclude() readonly _streetAddress: string;
  @Exclude() readonly _roadAddress: string;
  @Exclude() readonly _operationTime: string;
  @Exclude() readonly _photoBoothBrand: PhotoBoothBrand;

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
    return this._streetAddress;
  }

  @ApiProperty({
    description: '포토부스의 도로명 주소',
    example: '도로명 주소',
  })
  @Expose()
  get roadAddress(): string | null {
    return this._roadAddress;
  }

  @ApiProperty({
    description: '포토부스 업체명',
    example: '업체명',
  })
  @Expose()
  get brandName(): string {
    return this._photoBoothBrand.name;
  }
}

export class GetBoothBrandListDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _name: string;
  @Exclude() readonly _mainThumbnailImageUrl: string;
  @Exclude() readonly _description: string;
  @Exclude() readonly _photoBoothUrl: string;
  @Exclude() readonly _isEvent: boolean;
  @Exclude() readonly _brandHashtags: BrandHashtag[];

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
    return this._isEvent;
  }

  @ApiProperty({
    description: '포토부스의 대표 이미지',
  })
  @Expose()
  get mainThumbnailImageUrl(): string | null {
    return this._mainThumbnailImageUrl;
  }

  @ApiProperty({
    description: '포토부스의 해시태그',
  })
  @Expose()
  get hashtags(): BrandHashtag[] {
    return this._brandHashtags;
  }
}
