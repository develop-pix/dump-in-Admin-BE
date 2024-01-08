import { IsNotEmpty } from 'class-validator';
import { PhotoBoothReqBody } from './req-photo-booth-body.dto';
import { ToBoothProps } from '../photo-booth.interface';

export class MoveHiddenToOpenBooth extends PhotoBoothReqBody {
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
