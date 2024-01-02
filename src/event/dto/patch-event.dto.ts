import { IsOptional } from 'class-validator';
import { EventReqBodyDto, ToEntityProps } from './req-event-body.dto';

export class UpdateEventDto extends EventReqBodyDto {
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

export interface EventUpdateProps extends ToEntityProps {}
