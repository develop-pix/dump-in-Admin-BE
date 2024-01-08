import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { PhotoBoothBrand } from '../../brand/entity/brand.entity';

@Entity('photo_booth_brand_hashtag')
export class BrandHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) => photoBoothBrand.brandHashtags,
    {
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photoBoothBrand: PhotoBoothBrand;

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.brandhashtags, {
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of(brand: PhotoBoothBrand): BrandHashtag {
    const brandHashtag = new BrandHashtag();

    brandHashtag.photoBoothBrand = brand;

    return brandHashtag;
  }

  static create(hashtag: Hashtag): BrandHashtag {
    const brandHashtag = new BrandHashtag();

    brandHashtag.hashtag = hashtag;

    return brandHashtag;
  }
}
