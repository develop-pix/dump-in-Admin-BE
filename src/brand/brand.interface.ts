import { Hashtag } from 'src/hashtag/entity/hashtag.entity';
import { BrandImage } from './entity/brand-image.entity';

export interface BrandReqBodyProps {
  name: string;
  isEvent: boolean;
  hashtags: string[];
  description: string;
  photoBoothUrl: string;
  mainThumbnailImageUrl: string;
  images: string[];
}

export interface ToBrandProps
  extends Omit<BrandReqBodyProps, 'hashtags' | 'images'> {
  hashtags: Hashtag[];
  brandImages: BrandImage[];
}

export interface FindBrandOptionProps
  extends Pick<Partial<BrandReqBodyProps>, 'name' | 'isEvent'> {
  id?: number;
}
