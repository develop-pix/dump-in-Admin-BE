import { IsNotEmpty } from 'class-validator';
import { EventReqBody } from './req-event-body.dto';
import { EventCreateProps } from '../event.interface';

export class CreateEvent extends EventReqBody {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  mainThumbnailUrl: string;

  @IsNotEmpty()
  brandName: string;

  @IsNotEmpty()
  isPublic: boolean;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  toCreateEntity(): EventCreateProps {
    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      ...this.toEntity(),
    };
  }
}
