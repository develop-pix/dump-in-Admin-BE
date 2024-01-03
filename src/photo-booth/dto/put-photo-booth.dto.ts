import { IsNotEmpty } from 'class-validator';
import { PhotoBoothReqBodyDto } from './req-photo-booth-body.dto';
import { ToBoothProps } from '../photo-booth.interface';

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

  toMoveEntity(): ToBoothProps {
    return this.toEntity();
  }
}
