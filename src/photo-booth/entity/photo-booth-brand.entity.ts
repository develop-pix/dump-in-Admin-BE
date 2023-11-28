import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PhotoBoothNames } from '../photo-booth-name';
import { PhotoBooth } from './photo-booth.entity';

type PhotoBoothName = (typeof PhotoBoothNames)[number];

@Entity('photo_booth_brand')
export class PhotoBoothBrand {
  @PrimaryGeneratedColumn()
  photo_booth_brand_id: number;

  @Column({
    type: 'enum',
    enum: PhotoBoothNames,
  })
  name: PhotoBoothName;

  @OneToMany(
    () => PhotoBooth,
    (photoBooth: PhotoBooth) => photoBooth.photo_booth_brand,
    { eager: true },
  )
  photo_booths: PhotoBooth[];

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  //TODO: OneToMany
  @Column({ type: 'varchar', length: 128 })
  photo_booth_url: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  main_thumbnail_image_url: string;

  @Column({ type: 'bool' })
  is_event: boolean;
}
