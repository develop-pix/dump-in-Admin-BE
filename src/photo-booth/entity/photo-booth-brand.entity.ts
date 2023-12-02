import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';

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

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.photo_booth_hashtags)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
