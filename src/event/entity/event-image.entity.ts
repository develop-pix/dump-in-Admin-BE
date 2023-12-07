import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Events } from './event.entity';
import { BaseDateEntity } from 'src/common/entity/common-date.entity';

@Entity('event_image')
export class EventImage extends BaseDateEntity {
  @PrimaryGeneratedColumn({ name: 'event_image_id' })
  id: number;

  @ManyToOne(() => Events, (event: Events) => event.event_images)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @Column({ name: 'event_image_url' })
  event_image_url: string;
}
