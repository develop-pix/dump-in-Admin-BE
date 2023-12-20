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

  @IsOptional({ each: true })
  hashtags: string[];

  @IsOptional({ each: true })
  images: string[];

  getUpdateProps(): EventUpdateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
      startDate: this.startDate,
      endDate: this.endDate,
      hashtags: this.hashtags,
      images: this.images,
    };
  }
}

export interface EventUpdateProps extends Partial<EventReqBodyProps> {}
