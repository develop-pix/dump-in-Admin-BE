import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Hashtag,
  PhotoBoothBrand,
} from '../../photo-booth/entity/photo-booth-brand.entity';
import { EventImage } from './event-image.entity';

@Entity('event')
export class Events extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PhotoBoothBrand, (photoBooth) => photoBooth.events)
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photo_booth_brand: PhotoBoothBrand;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  main_thumbnail_url: string;

  @Column()
  period: string;

  @Column()
  view_count: number;

  @Column()
  likes_count: number;

  @Column()
  is_public: boolean;

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

  static of({ title, brand }): Events {
    const event = new Events();

    event.title = title;
    event.photo_booth_brand = brand;

    return event;
  }

  static create({ title, brandName, content, main_thumbnail_url }): Events {
    const event = new Events();
    event.photo_booth_brand = new PhotoBoothBrand();

    event.title = title;
    event.content = content;
    event.main_thumbnail_url = main_thumbnail_url;
    event.photo_booth_brand.name = brandName;

    return event;
  }
}

@Entity('event_hashtag')
export class EventHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Events, (photoBoothBrand: Events) => photoBoothBrand.events)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.event_hashtag, {
    eager: true,
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of({ event }): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.event = new Events();
    eventHashtag.event = event;

    return eventHashtag;
  }

  static create({ event, hashtag }): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.event = new Events();
    eventHashtag.hashtag = new Hashtag();

    eventHashtag.event = event;
    eventHashtag.hashtag = hashtag;

    return eventHashtag;
  }
}
