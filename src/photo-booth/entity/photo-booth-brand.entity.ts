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
    () => PhotoBoothCategory,
    (photoBoothCategory: PhotoBoothCategory) =>
      photoBoothCategory.photo_booth_brand,
  )
  photo_booth_categories: PhotoBoothCategory[];
}

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  order_number: number;

  @OneToMany(
    () => PhotoBoothCategory,
    (photoBoothCategory: PhotoBoothCategory) => photoBoothCategory.category,
  )
  photo_booth_categories: PhotoBoothCategory[];
}

@Entity('photo_booth_category')
export class PhotoBoothCategory {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) =>
      photoBoothBrand.photo_booth_categories,
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photo_booth_brand: PhotoBoothBrand;

  @ManyToOne(
    () => Category,
    (category: Category) => category.photo_booth_categories,
  )
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
