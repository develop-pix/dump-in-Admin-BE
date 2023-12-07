import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';
import { FindBrandOptionProps } from '../dto/get-photo-booth-query.dto';
import { BrandCreateProps } from '../dto/post-photo-booth.dto';
import { BrandUpdateProps } from '../dto/patch-photo-booth.dto';
import { Events } from '../../event/entity/event.entity';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { BrandHashtag } from '../../hashtag/entity/photo-booth-hashtag.entity';

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
    () => BrandHashtag,
    (photoBoothHashtag: BrandHashtag) => photoBoothHashtag.photo_booth_brand,
  )
  photo_booth_hashtags: BrandHashtag[];

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
