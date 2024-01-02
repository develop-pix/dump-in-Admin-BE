import { IsOptional } from 'class-validator';
import { EventReqBodyDto, EventReqBodyProps } from './req-event-body.dto';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { EventImage } from '../entity/event-image.entity';

export class UpdateEventDto extends EventReqBodyDto {
  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  mainThumbnailUrl: string;

  @IsOptional()
  brandName: string;

  @IsOptional()
  isPublic: boolean;

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  getUpdateProps(): EventUpdateProps {
    const arrayProps = this.getArrayProps();
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
      startDate: this.startDate,
      endDate: this.endDate,
      // hashtags: this.hashtags,
      // images: this.images,
      ...arrayProps,
    };
  }
}

export interface EventUpdateProps
  extends Omit<EventReqBodyProps, 'hashtags' | 'images'> {
  hashtags: Hashtag[];
  images: EventImage[];
}
