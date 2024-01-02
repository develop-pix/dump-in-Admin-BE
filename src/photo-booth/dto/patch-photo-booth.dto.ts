import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  BrandReqBodyDto,
  BrandReqBodyProps,
  PhotoBoothReqBodyDto,
  PhotoBoothReqBodyProps,
} from './req-photo-booth-body.dto';
import { BrandImage } from '../../brand/entity/brand-image.entity';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';

export class UpdatePhotoBoothDto extends PickType(PhotoBoothReqBodyDto, [
  'name',
  'location',
  'streetAddress',
  'roadAddress',
  'brandName',
  'operationTime',
]) {
  @IsOptional()
  name: string;

  @IsOptional()
  location: string;

  @IsOptional()
  streetAddress: string;

  @IsOptional()
  roadAddress: string;

  @IsOptional()
  brandName: string;

  @IsOptional()
  operationTime: string;

  getUpdateProps(): PhotoBoothUpdateProps {
    return {
      name: this.name,
      location: this.location,
      streetAddress: this.streetAddress,
      roadAddress: this.roadAddress,
      brandName: this.brandName,
      operationTime: this.operationTime,
    };
  }
}

export class UpdateBoothBrandDto extends BrandReqBodyDto {
  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  photoBoothUrl: string;

  @IsOptional()
  isEvent: boolean;

  @IsOptional()
  mainThumbnailImageUrl: string;

  getUpdateProps(): BrandUpdateProps {
    const arrayProps = this.getArrayProps();
    return {
      name: this.name,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      isEvent: this.isEvent,
      // hashtags: this.hashtags,
      // images: this.images,
      ...arrayProps,
    };
  }
}

export interface BrandUpdateProps
  extends Omit<BrandReqBodyProps, 'hashtags' | 'images'> {
  hashtags: Hashtag[];
  images: BrandImage[];
}

export interface PhotoBoothUpdateProps
  extends Partial<PhotoBoothReqBodyProps> {}
