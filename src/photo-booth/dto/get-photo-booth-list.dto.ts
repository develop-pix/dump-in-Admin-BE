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
  @Exclude() readonly _createdAt: Date;
  @Exclude() readonly _updatedAt: Date;
  @Exclude() readonly _likeCount: number | undefined;
  @Exclude() readonly _viewCount: number | undefined;
  @Exclude() readonly _streetAddress?: string | null;
  @Exclude() readonly _roadAddress?: string | null;
  @Exclude() readonly _operationTime?: string | null;
  @Type(() => PhotoBoothBrand)
  @Exclude()
  readonly _photoBoothBrand: PhotoBoothBrand | undefined;

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
  @Type(() => PhotoBoothBrand)
  get brandName(): PhotoBoothBrand {
    return this._photoBoothBrand;
  }
}

export class GetBoothBrandListDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _name: string;
  @Exclude() readonly _mainThumbnailImageUrl?: string | null;
  @Exclude() readonly _description?: string | null;
  @Exclude() readonly _photoBoothUrl?: string | null;
  @Exclude() readonly _isEvent: boolean;
  @Exclude()
  @Type(() => BrandHashtag)
  readonly _brandHashtags: BrandHashtag[] | null;

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
