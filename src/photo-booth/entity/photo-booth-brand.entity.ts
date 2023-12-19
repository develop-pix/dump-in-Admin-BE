import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';
import { FindBrandOptionProps } from '../dto/get-photo-booth-query.dto';
import { Events } from '../../event/entity/event.entity';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';
import { BrandImage } from './photo-booth-brand-image.entity';

@Entity('photo_booth_brand')
export class PhotoBoothBrand {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
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
  )
  photoBooths: PhotoBooth[];

  @OneToMany(
    () => BrandHashtag,
    (photoBoothHashtag: BrandHashtag) => photoBoothHashtag.photoBoothBrand,
  )
  brandHashtags: BrandHashtag[];

  @OneToMany(() => Events, (event: Events) => event.photoBoothBrand)
  events: Events[];

  @OneToMany(() => BrandImage, (image) => image.photoBoothBrand, {
    cascade: true,
  })
  images: BrandImage[];

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
