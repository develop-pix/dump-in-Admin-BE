import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBooth } from './photo-booth.entity';

@Entity('photo_booth_brand')
export class PhotoBoothBrand {
  @PrimaryGeneratedColumn({ name: 'id' })
  photo_booth_brand_id: number;

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
}
