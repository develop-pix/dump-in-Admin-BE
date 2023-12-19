import { IsNotEmpty } from 'class-validator';
import { BrandReqBodyDto, BrandReqBodyProps } from './req-photo-booth-body.dto';

export class CreateBoothBrandDto extends BrandReqBodyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mainThumbnailImageUrl: string;

  @IsNotEmpty()
  isEvent: boolean;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  hashtags: string[];

  @IsNotEmpty()
  photoBoothUrl: string;

  @IsNotEmpty()
  images: string[];

  getCreateProps(): BrandCreateProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      hashtags: this.hashtags,
      images: this.images,
    };
  }
}

export interface BrandCreateProps extends BrandReqBodyProps {}
