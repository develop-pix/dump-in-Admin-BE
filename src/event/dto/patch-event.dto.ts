import { IsOptional } from 'class-validator';
import { EventReqBody } from './req-event-body.dto';
import { EventUpdateProps } from '../event.interface';

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

  toUpdateEntity(): EventUpdateProps {
    return this.toEntity();
  }
}
