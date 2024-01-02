import { IsNotEmpty } from 'class-validator';
import { BrandReqBodyDto } from '../../photo-booth/dto/req-photo-booth-body.dto';
import { BrandUpdateProps } from '../../photo-booth/dto/patch-photo-booth.dto';

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
  photoBoothUrl: string;

  getCreateProps(): BrandCreateProps {
    const arrayProps = this.getArrayProps();
    return {
      name: this.name,
      isEvent: this.isEvent,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      // hashtags: this.hashtags,
      // images: this.images,
      ...arrayProps,
    };
  }
}

export interface BrandCreateProps extends BrandUpdateProps {}
