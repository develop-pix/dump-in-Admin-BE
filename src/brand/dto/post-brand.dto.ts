import { IsNotEmpty } from 'class-validator';
import { BrandReqBody } from './req-brand-body.dto';
import { ToBrandProps } from '../brand.interface';

export class CreateBoothBrand extends BrandReqBody {
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

  toCreateEntity(): ToBrandProps {
    return this.toEntity();
  }
}
