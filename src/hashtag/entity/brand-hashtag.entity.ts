import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';

@Entity('photo_booth_brand_hashtag')
export class BrandHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) => photoBoothBrand.brandHashtags,
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photoBoothBrand: PhotoBoothBrand;

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.brandhashtags, {
    eager: true,
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of(brand: PhotoBoothBrand): BrandHashtag {
    const brandHashtag = new BrandHashtag();

    brandHashtag.photoBoothBrand = brand;

    return brandHashtag;
  }

  static create(brand: PhotoBoothBrand, hashtag: Hashtag): BrandHashtag {
    const brandHashtag = new BrandHashtag();

    brandHashtag.hashtag = hashtag;
    brandHashtag.photoBoothBrand = brand;

    return brandHashtag;
  }
}
