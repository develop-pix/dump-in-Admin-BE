import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Events } from './event.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';

@Entity('event_image')
export class EventImage extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Events, (event: Events) => event.eventImages, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @Column({ name: 'event_image_url' })
  eventImageUrl: string;

  static create(url: string) {
    const eventImage = new EventImage();

    eventImage.eventImageUrl = url;
    eventImage.createdAt = new Date();
    eventImage.updatedAt = new Date();

    return eventImage;
  }
}
