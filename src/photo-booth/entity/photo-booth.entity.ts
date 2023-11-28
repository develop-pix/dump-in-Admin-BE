import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PhotoBoothBrand } from './photo-booth-brand.entity';

@Entity('photo_booth')
export class PhotoBooth extends BaseDateEntity {
  @ManyToOne(() => PhotoBoothBrand, { eager: true }) // eager: true는 PhotoBooth를 불러올 때 바로 PhotoBoothBrand를 가져오도록 합니다.
  photo_booth_brand: PhotoBoothBrand;

  @PrimaryGeneratedColumn()
  photo_booth_id: number;

  @Column({ type: 'varchar', length: 64 })
  location: string;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  latitude: number;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  longitude: number;

  @Column({ type: 'varchar', length: 64 })
  street_address: string;

  @Column({ type: 'varchar', length: 64 })
  road_address: string;

  @Column({ type: 'varchar', length: 128 })
  address_detail: string;

  @Column({ type: 'varchar', length: 64 })
  operation_time: string;

  @Column({ type: 'int' })
  likes_count: number;

  @Column({ type: 'int' })
  view_count: number;

  @Column({ type: 'boolean', default: false })
  is_public: boolean;
}
