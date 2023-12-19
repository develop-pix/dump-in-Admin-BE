import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';
import { FindBrandOptionProps } from '../dto/get-photo-booth-query.dto';
import { Events } from '../../event/entity/event.entity';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { BrandImage } from './photo-booth-brand-image.entity';

@Entity('photo_booth_brand')
export class PhotoBoothBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'photo_booth_url' })
  photoBoothUrl: string;

  @Column({ name: 'main_thumbnail_image_url' })
  mainThumbnailImageUrl: string;

  @Column({ name: 'is_event' })
  isEvent: boolean;

  @OneToMany(
    () => PhotoBooth,
    (photoBooth: PhotoBooth) => photoBooth.photoBoothBrand,
    { lazy: true },
  )
  photoBooths: PhotoBooth[];

  @OneToMany(
    () => BrandHashtag,
    (photoBoothHashtag: BrandHashtag) => photoBoothHashtag.photoBoothBrand,
    {
      cascade: true,
      orphanedRowAction: 'delete',
    },
  )
  brandHashtags: BrandHashtag[];

  @OneToMany(() => Events, (event: Events) => event.photoBoothBrand, {
    lazy: true,
  })
  events: Events[];

  @OneToMany(() => BrandImage, (image: BrandImage) => image.photoBoothBrand, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  brandImages: BrandImage[];

  static of({ name, isEvent }: FindBrandOptionProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.isEvent = isEvent;

    return brand;
  }

  static byId(id: number): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.id = id;

    return brand;
  }

  static byName(name: string): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;

    return brand;
  }
}
