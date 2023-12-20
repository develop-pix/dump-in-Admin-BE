import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';
import { Events } from '../entity/event.entity';
import { EventImage } from '../entity/event-image.entity';
import { EventHashtag } from '../../hashtag/entity/event-hashtag.entity';

export class GetEventListDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _title: string;
  @Exclude() readonly _content: string;
  @Exclude() readonly _mainThumbnailUrl: string;
  @Exclude() readonly _startDate: Date;
  @Exclude() readonly _endDate: Date;
  @Exclude() readonly _viewCount: number;
  @Exclude() readonly _likeCount: number;
  @Exclude() readonly _isPublic: boolean;
  @Exclude() readonly _photoBoothBrand: PhotoBoothBrand;
  @Exclude() readonly _eventImages: EventImage[];
  @Exclude() readonly _eventHashtags: EventHashtag[];

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
    return this._mainThumbnailUrl;
  }

  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @Expose()
  get brandName(): string {
    return this._photoBoothBrand.name;
  }

  @ApiProperty({
    description: '이벤트와 관련된 해시태그',
  })
  @Expose()
  @Type(() => EventHashtag)
  get hashtags(): EventHashtag[] {
    return this._eventHashtags;
  }
}
