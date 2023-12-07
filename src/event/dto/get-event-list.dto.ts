import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class GetBoothBrandListDto {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _main_thumbnail_image_url?: string | null;
  @Exclude() private readonly _is_event: boolean;
  @Exclude()
  @Type(() => PhotoBoothHashtag)
  private readonly _photo_booth_hashtags: PhotoBoothHashtag[] | null;

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
  get hashtags(): string[] {
    return (
      this._photo_booth_hashtags?.map((hashtags) => hashtags.hashtag.name) || []
    );
  }
}
