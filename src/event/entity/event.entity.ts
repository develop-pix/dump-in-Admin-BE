import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';
import { EventImage } from './event-image.entity';
import { EventCreateProps } from '../dto/post-event.dto';
import { EventUpdateProps } from '../dto/patch-event.dto';
import { FindEventOptionProps } from '../dto/get-event-query.dto';
import { EventHashtag } from '../../hashtag/entity/event-hashtag.entity';

@Entity('event')
export class Events extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  main_thumbnail_url: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  view_count: number;

  @Column()
  likes_count: number;

  @Column()
  is_public: boolean;

  @ManyToOne(() => PhotoBoothBrand, (photoBooth) => photoBooth.events)
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photo_booth_brand: PhotoBoothBrand;

  @OneToMany(() => EventImage, (eventImage: EventImage) => eventImage.event)
  event_images: EventImage[];

  @OneToMany(
    () => EventHashtag,
    (eventHashtag: EventHashtag) => eventHashtag.event,
  )
  events: Events[];

  // @OneToMany(() => User, (user) => user.events)
  // @JoinColumn({ name: 'user_id' })
  // users: User[];

  static byId(id: number): Events {
    const event = new Events();

    event.id = id;

    return event;
  }

  static byTitle(title: string): Events {
    const event = new Events();

    event.title = title;

    return event;
  }

  static of({ title, brand }: FindEventOptionProps): Events {
    const event = new Events();

    event.title = title;
    event.photo_booth_brand = brand;

    return event;
  }

  static create({
    title,
    brand,
    content,
    isPublic,
    mainThumbnailUrl,
    startDate,
    endDate,
  }: EventCreateProps): Events {
    const event = new Events();
    event.photo_booth_brand = new PhotoBoothBrand();

    event.title = title;
    event.content = content;
    event.main_thumbnail_url = mainThumbnailUrl;
    event.photo_booth_brand = brand;
    event.is_public = isPublic;
    event.start_date = startDate;
    event.end_date = endDate;

    return event;
  }

  static updateBy({
    title,
    brand,
    content,
    isPublic,
    mainThumbnailUrl,
    startDate,
    endDate,
  }: EventUpdateProps): Events {
    const event = new Events();
    event.photo_booth_brand = new PhotoBoothBrand();

    event.title = title;
    event.content = content;
    event.main_thumbnail_url = mainThumbnailUrl;
    event.photo_booth_brand = brand;
    event.is_public = isPublic;
    event.start_date = startDate;
    event.end_date = endDate;

    return event;
  }
}
