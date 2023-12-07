import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';

@Entity('photo_booth_hashtag')
export class BrandHashtag {
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

  static of(brand: PhotoBoothBrand): BrandHashtag {
    const photoBoothHashtag = new BrandHashtag();

    photoBoothHashtag.photo_booth_brand = new PhotoBoothBrand();
    photoBoothHashtag.photo_booth_brand = brand;

    return photoBoothHashtag;
  }

  static create(brand: PhotoBoothBrand, hashtag: Hashtag): BrandHashtag {
    const photoBoothHashtag = new BrandHashtag();

    photoBoothHashtag.photo_booth_brand = new PhotoBoothBrand();
    photoBoothHashtag.hashtag = new Hashtag();

    photoBoothHashtag.hashtag = hashtag;
    photoBoothHashtag.photo_booth_brand = brand;

    return photoBoothHashtag;
  }
}
