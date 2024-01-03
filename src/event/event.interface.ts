import { PhotoBoothBrand } from '../brand/entity/brand.entity';
import { Hashtag } from '../hashtag/entity/hashtag.entity';
import { EventImage } from './entity/event-image.entity';

export interface ToEventProps
  extends Omit<EventReqBodyProps, 'brandName' | 'hashtags' | 'images'> {
  brandName: PhotoBoothBrand;
  hashtags: Hashtag[];
  images: EventImage[];
}

export interface EventReqBodyProps {
  title: string;
  content: string;
  mainThumbnailUrl: string;
  brandName: string;
  isPublic: boolean;
  startDate: Date;
  endDate: Date;
  hashtags: string[];
  images: string[];
}

export interface EventCreateProps extends ToEventProps {
  createdAt: Date;
  updatedAt: Date;
}

export interface EventUpdateProps extends ToEventProps {}

export interface FindEventOptionProps
  extends Pick<EventReqBodyProps, 'brandName' | 'title'> {}
