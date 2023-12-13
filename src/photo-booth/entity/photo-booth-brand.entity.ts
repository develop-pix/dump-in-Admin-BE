import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';
import { FindBrandOptionProps } from '../dto/get-photo-booth-query.dto';
import { BrandCreateProps } from '../dto/post-photo-booth.dto';
import { BrandUpdateProps } from '../dto/patch-photo-booth.dto';
import { Events } from '../../event/entity/event.entity';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { BrandHashtag } from '../../hashtag/entity/brand-hashtag.entity';

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

  static create({
    name,
    mainThumbnailImageUrl,
    isEvent,
  }: BrandCreateProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.mainThumbnailImageUrl = mainThumbnailImageUrl;
    brand.isEvent = isEvent;

    return brand;
  }

  static updateBy({
    name,
    description,
    photoBoothUrl,
    mainThumbnailImageUrl,
    isEvent,
  }: BrandUpdateProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.description = description;
    brand.photoBoothUrl = photoBoothUrl;
    brand.mainThumbnailImageUrl = mainThumbnailImageUrl;
    brand.isEvent = isEvent;

    return brand;
  }

  static of({
    name,
    isEvent,
    hashtags,
  }: FindBrandOptionProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.isEvent = isEvent;
    brand.brandHashtags = hashtags.map((tag) => {
      const hashtag = new BrandHashtag();
      hashtag.hashtag = new Hashtag();
      hashtag.hashtag.name = tag;
      return hashtag;
    });

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
