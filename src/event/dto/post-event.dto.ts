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

  @IsNotEmpty({ each: true })
  hashtags: string[];

  @IsNotEmpty({ each: true })
  images: string[];

  getCreateProps(): EventCreateProps {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export interface EventCreateProps extends EventReqBodyProps {
  createdAt: Date;
  updatedAt: Date;
}
