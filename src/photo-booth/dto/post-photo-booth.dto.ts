import { IsNotEmpty } from 'class-validator';
import { BrandReqBodyDto, BrandReqBodyProps } from './req-photo-booth-body.dto';

export class CreateBoothBrandDto extends BrandReqBodyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mainThumbnailImageUrl: string;

  @IsNotEmpty()
  isEvent: boolean = false;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  hashtags: string[];

  @IsNotEmpty()
  photoBoothUrl: string;

  getCreateProps(): BrandCreateProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      hashtags: (this.hashtags || []).filter((tag) => tag.trim() !== ''),
    };
  }
}

export interface BrandCreateProps extends BrandReqBodyProps {}
