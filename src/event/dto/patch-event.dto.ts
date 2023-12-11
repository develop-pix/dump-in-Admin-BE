import { IsOptional } from 'class-validator';
import { EventReqBodyDto, EventReqBodyProps } from './req-event-body.dto';

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

  @IsOptional()
  hashtags: string[];

  getUpdateProps(): EventUpdateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      startDate: this.startDate,
      endDate: this.endDate,
      isPublic: this.isPublic,
      hashtags: (this.hashtags || []).filter((tag) => tag.trim() !== ''),
    };
  }
}

export interface EventUpdateProps extends Partial<EventReqBodyProps> {}
