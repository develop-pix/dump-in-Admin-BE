import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { PhotoBoothBrand } from '../../brand/entity/brand.entity';
import { EventImage } from './event-image.entity';
import { EventHashtag } from '../../hashtag/entity/event-hashtag.entity';
import { FindEventOptionProps } from '../event.interface';

@Entity('event')
export class Events extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'main_thumbnail_image_url' })
  mainThumbnailUrl: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'view_count' })
  viewCount: number;

  @Column({ name: 'like_count' })
  likeCount: number;

  @Column({ name: 'is_public' })
  isPublic: boolean;

  @ManyToOne(() => PhotoBoothBrand, (brand: PhotoBoothBrand) => brand.events)
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photoBoothBrand: PhotoBoothBrand;

  @OneToMany(() => EventImage, (eventImage: EventImage) => eventImage.event, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  eventImages: EventImage[];

  @OneToMany(
    () => EventHashtag,
    (eventHashtag: EventHashtag) => eventHashtag.event,
    {
      cascade: true,
      orphanedRowAction: 'delete',
    },
  )
  eventHashtags: EventHashtag[];

  static byId(id: number): Events {
    const event = new Events();

    event.id = id;

    return event;
  }

  static of({ title, brandName }: FindEventOptionProps): Events {
    const event = new Events();

    event.title = title;
    event.photoBoothBrand = PhotoBoothBrand.byName(brandName);

    return event;
  }
}
