import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  BrandReqBodyDto,
  BrandReqBodyProps,
  PhotoBoothReqBodyDto,
  PhotoBoothReqBodyProps,
} from './req-photo-booth-body.dto';

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
      isDelete: false,
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

  @IsOptional()
  hashtags: string[];

  getUpdateProps(): BrandUpdateProps {
    return {
      name: this.name,
      description: this.description,
      photoBoothUrl: this.photoBoothUrl,
      mainThumbnailImageUrl: this.mainThumbnailImageUrl,
      isEvent: this.isEvent,
      hashtags: this.hashtags,
    };
  }
}

export interface BrandUpdateProps extends BrandReqBodyProps {}

export interface PhotoBoothUpdateProps extends Partial<PhotoBoothReqBodyProps> {
  isDelete: boolean;
}
