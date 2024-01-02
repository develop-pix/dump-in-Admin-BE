import { IsNotEmpty } from 'class-validator';
import { EventReqBodyDto } from './req-event-body.dto';
import { EventUpdateProps } from './patch-event.dto';

export class CreateEventDto extends EventReqBodyDto {
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

export interface EventCreateProps extends EventUpdateProps {
  createdAt: Date;
  updatedAt: Date;
}
