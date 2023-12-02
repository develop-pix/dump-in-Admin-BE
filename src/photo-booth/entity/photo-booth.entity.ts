import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PhotoBoothBrand } from './photo-booth-brand.entity';
import { FindBoothOptionWhere } from '../dto/get-photo-booth-query.dto';

export interface PhotoBoothUpdateProps {
  name: string;
  location: string;
  street_address: string;
  road_address: string;
}

@Entity('photo_booth')
export class PhotoBooth extends BaseDateEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  location: string;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  latitude: number;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  longitude: number;

  @Column({ type: 'varchar', length: 64 })
  street_address: string;

  @Column({ type: 'varchar', length: 64 })
  road_address: string;

  @Column({ type: 'varchar', length: 64 })
  operation_time: string;

  @Column({ type: 'int' })
  likes_count: number;

  @Column({ type: 'int' })
  view_count: number;

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) => photoBoothBrand.photo_booths,
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photo_booth_brand: PhotoBoothBrand;

  static byId({ id }: FindBoothOptionWhere) {
    const photoBooth = new PhotoBooth();

    photoBooth.id = id;

    return photoBooth;
  }

  static of({ location, name }: FindBoothOptionWhere) {
    const photoBooth = new PhotoBooth();

    photoBooth.location = location;
    photoBooth.name = name;

    return photoBooth;
  }

  static updateBy({
    name,
    location,
    street_address,
    road_address,
  }: PhotoBoothUpdateProps): PhotoBooth {
    const photoBooth = new PhotoBooth();

    photoBooth.name = name;
    photoBooth.location = location;
    photoBooth.street_address = street_address;
    photoBooth.road_address = road_address;

    return photoBooth;
  }
}
