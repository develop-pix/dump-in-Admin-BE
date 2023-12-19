import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PhotoBoothBrand } from './photo-booth-brand.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';

@Entity('photo_booth_brand_image')
export class BrandImage extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PhotoBoothBrand, (brand) => brand.brandImages, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photoBoothBrand: PhotoBoothBrand;

  @Column({ name: 'photo_booth_brand_image_url' })
  brandImageUrl: string;

  static create(url: string) {
    const brandImage = new BrandImage();

    brandImage.brandImageUrl = url;
    brandImage.createdAt = new Date();
    brandImage.updatedAt = new Date();

    return brandImage;
  }
}
