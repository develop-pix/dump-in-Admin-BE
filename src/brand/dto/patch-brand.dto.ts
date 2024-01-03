import { IsOptional } from 'class-validator';
import { BrandReqBody } from './req-brand-body.dto';
import { ToBrandProps } from '../brand.interface';

export class UpdateBoothBrand extends BrandReqBody {
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

  toUpdateEntity(): ToBrandProps {
    return this.toEntity();
  }
}
