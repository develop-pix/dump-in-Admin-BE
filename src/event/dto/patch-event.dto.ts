import { IsOptional } from 'class-validator';
import { EventReqBody } from './req-event-body.dto';
import { ToEventProps } from '../event.interface';

export class UpdateEvent extends EventReqBody {
  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  mainThumbnailUrl: string;

  @IsOptional()
  brandName: string;

  @IsOptional()
  isPublic: boolean;

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  toUpdateEntity(): ToEventProps {
    return this.toEntity();
  }
}
