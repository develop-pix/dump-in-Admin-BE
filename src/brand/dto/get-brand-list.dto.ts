import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothBrand } from '../../brand/entity/brand.entity';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { BrandImage } from '../../brand/entity/brand-image.entity';

export class GetBrandList {
  @Exclude() readonly _id: number;
  @Exclude() readonly _name: string;
  @Exclude() readonly _mainThumbnailImageUrl: string;
  @Exclude() readonly _description: string;
  @Exclude() readonly _photoBoothUrl: string;
  @Exclude() readonly _isEvent: boolean;
  @Exclude() readonly _brandHashtags: BrandHashtag[];
  @Exclude() readonly _brandImages: BrandImage[];

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
  get hashtags(): string[] {
    return this._brandHashtags.map((hashtags) => hashtags.hashtag.name);
  }
}
