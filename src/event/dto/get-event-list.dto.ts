import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';
import { Events } from '../entity/event.entity';

export class GetEventListDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _title: string;
  @Exclude() readonly _content: string;
  @Exclude() readonly _main_thumbnail_url: string;
  @Exclude() readonly _start_date: Date;
  @Exclude() readonly _end_date: Date;
  @Exclude() readonly _view_count: number;
  @Exclude() readonly _likes_count: number;
  @Exclude() readonly _is_public: boolean;
  @Exclude() readonly _photo_booth_brand: PhotoBoothBrand;

  constructor(data: Events) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '이벤트의 id 값' })
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty({
    description: '이벤트의 제목',
  })
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty({
    description: '이벤트의 내용',
  })
  @Expose()
  get content(): string {
    return this._content;
  }

  @ApiProperty({
    description: '이벤트의 대표 이미지',
  })
  @Expose()
  get mainThumbnailUrl(): string {
    return this._main_thumbnail_url;
  }

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @Expose()
  @Type(() => PhotoBoothBrand)
  get brandName(): PhotoBoothBrand {
    return this._photo_booth_brand;
  }
}
