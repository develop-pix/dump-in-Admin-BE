import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';
import { FindBrandOptionProps } from '../dto/get-photo-booth-query.dto';
import { BrandCreateProps } from '../dto/post-photo-booth.dto';
import { BrandUpdateProps } from '../dto/patch-photo-booth.dto';
import { EventHashtag, Events } from '../../event/entity/event.entity';

@Entity('photo_booth_brand')
export class PhotoBoothBrand {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 128 })
  photo_booth_url: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  main_thumbnail_image_url: string;

  @Column({ type: 'bool' })
  is_event: boolean;

  @OneToMany(
    () => PhotoBooth,
    (photoBooth: PhotoBooth) => photoBooth.photo_booth_brand,
  )
  photo_booths: PhotoBooth[];

  @OneToMany(
    () => PhotoBoothHashtag,
    (photoBoothHashtag: PhotoBoothHashtag) =>
      photoBoothHashtag.photo_booth_brand,
  )
  photo_booth_hashtags: PhotoBoothHashtag[];

  @OneToMany(() => Events, (event: Events) => event.photo_booth_brand)
  events: Events[];

  static create({
    name,
    mainThumbnailImageUrl,
    isEvent,
  }: BrandCreateProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.main_thumbnail_image_url = mainThumbnailImageUrl;
    brand.is_event = isEvent;

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
    brand.photo_booth_url = photoBoothUrl;
    brand.main_thumbnail_image_url = mainThumbnailImageUrl;
    brand.is_event = isEvent;

    return brand;
  }

  static of({
    name,
    isEvent,
    hashtags,
  }: FindBrandOptionProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;
    brand.is_event = isEvent;
    brand.photo_booth_hashtags = hashtags.map((tag) => {
      const hashtag = new PhotoBoothHashtag();
      hashtag.hashtag = new Hashtag();
      hashtag.hashtag.name = tag;
      return hashtag;
    });

    return brand;
  }

  static byId({ id }: FindBrandOptionProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.id = id;

    return brand;
  }

  static byName({ name }: FindBrandOptionProps): PhotoBoothBrand {
    const brand = new PhotoBoothBrand();

    brand.name = name;

    return brand;
  }
}

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  order_number: number;

  @OneToMany(
    () => PhotoBoothHashtag,
    (photoBoothHashtag: PhotoBoothHashtag) => photoBoothHashtag.hashtag,
  )
  photo_booth_hashtags: PhotoBoothHashtag[];

  @OneToMany(
    () => EventHashtag,
    (eventHashtag: EventHashtag) => eventHashtag.hashtag,
  )
  event_hashtag: EventHashtag[];

  static of({ id, name }: FindHashtagOptionsProps): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;
    hashtag.id = id;

    return hashtag;
  }

  static create({ name }: HashtagCreateProps): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;

    return hashtag;
  }
}

export interface FindHashtagOptionsProps {
  id?: number;
  name: string;
}

export interface HashtagCreateProps {
  name: string;
}

@Entity('photo_booth_hashtag')
export class PhotoBoothHashtag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) => photoBoothBrand.photo_booth_hashtags,
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photo_booth_brand: PhotoBoothBrand;

  @ManyToOne(
    () => Hashtag,
    (hashtag: Hashtag) => hashtag.photo_booth_hashtags,
    { eager: true },
  )
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of({ brand }: FindPhotoBoothHashtagOptionsProps): PhotoBoothHashtag {
    const photoBoothHashtag = new PhotoBoothHashtag();

    photoBoothHashtag.photo_booth_brand = new PhotoBoothBrand();
    photoBoothHashtag.photo_booth_brand = brand;

    return photoBoothHashtag;
  }

  static create({
    brand,
    hashtag,
  }: PhotoBoothHashtagCreateProps): PhotoBoothHashtag {
    const photoBoothHashtag = new PhotoBoothHashtag();

    photoBoothHashtag.photo_booth_brand = new PhotoBoothBrand();
    photoBoothHashtag.hashtag = new Hashtag();

    photoBoothHashtag.hashtag = hashtag;
    photoBoothHashtag.photo_booth_brand = brand;

    return photoBoothHashtag;
  }
}

export interface FindPhotoBoothHashtagOptionsProps {
  brand: PhotoBoothBrand;
}

export interface PhotoBoothHashtagCreateProps {
  brand: PhotoBoothBrand;
  hashtag: Hashtag;
}
