import { IsOptional } from 'class-validator';
import { PhotoBoothReqBodyDto } from './req-photo-booth-body.dto';
import { ToBoothProps } from '../photo-booth.interface';

export class UpdatePhotoBoothDto extends PhotoBoothReqBodyDto {
  @IsOptional()
  name: string;

  @IsOptional()
  longitude: number;

  @IsOptional()
  latitude: number;

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

  toUpdateEntity(): ToBoothProps {
    return this.toEntity();
  }
}
