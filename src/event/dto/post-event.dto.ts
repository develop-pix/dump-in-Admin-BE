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

  getCreateProps(): EventCreateProps {
    const arrayProps = this.getArrayProps();
    return {
      title: this.title,
      content: this.content,
      mainThumbnailUrl: this.mainThumbnailUrl,
      brandName: this.brandName,
      isPublic: this.isPublic,
      startDate: this.startDate,
      endDate: this.endDate,
      // hashtags: this.hashtags,
      // images: this.images,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...arrayProps,
    };
  }
}

export interface EventCreateProps extends EventUpdateProps {
  createdAt: Date;
  updatedAt: Date;
}
