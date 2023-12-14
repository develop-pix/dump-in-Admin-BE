import { IsNotEmpty } from 'class-validator';
import { EventReqBodyDto, EventReqBodyProps } from './req-event-body.dto';

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

  @IsNotEmpty()
  hashtags: string[];

  getCreateProps(): EventCreateProps {
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
      startDate: this.startDate,
      endDate: this.endDate,
      hashtags: (this.hashtags || []).filter((tag) => tag.trim() !== ''),
    };
  }
}

export interface EventCreateProps extends EventReqBodyProps {}
