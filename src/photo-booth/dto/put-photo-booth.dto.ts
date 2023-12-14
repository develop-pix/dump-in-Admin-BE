import { IsNotEmpty } from 'class-validator';
import {
  PhotoBoothReqBodyDto,
  PhotoBoothReqBodyProps,
} from './req-photo-booth-body.dto';

export class MoveHiddenToOpenBoothDto extends PhotoBoothReqBodyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  streetAddress: string;

  @IsNotEmpty()
  roadAddress: string;

  @IsNotEmpty()
  operationTime: string;

  @IsNotEmpty()
  brandName: string;

  getUpdateProps(): MoveToOpenBoothProps {
    return {
      name: this.name,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      brandName: this.brandName,
      roadAddress: this.roadAddress,
      streetAddress: this.streetAddress,
      operationTime: this.operationTime,
    };
  }
}

export interface MoveToOpenBoothProps extends PhotoBoothReqBodyProps {}
