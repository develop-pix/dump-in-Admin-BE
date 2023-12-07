import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PhotoBoothBrand } from './photo-booth-brand.entity';
import { FindBoothOptionProps } from '../dto/get-photo-booth-query.dto';
import { PhotoBoothUpdateProps } from '../dto/patch-photo-booth.dto';
import { MoveToOpenBoothProps } from '../dto/put-photo-booth.dto';

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

  static byId(id: string) {
    const photoBooth = new PhotoBooth();

    photoBooth.id = id;

    return photoBooth;
  }

  static of({ location, name, brand }: FindBoothOptionProps) {
    const photoBooth = new PhotoBooth();

    photoBooth.location = location;
    photoBooth.name = name;
    photoBooth.photo_booth_brand = brand;

    return photoBooth;
  }

  static updateBy({
    name,
    location,
    streetAddress,
    roadAddress,
    brand,
  }: PhotoBoothUpdateProps): PhotoBooth {
    const photoBooth = new PhotoBooth();

    photoBooth.name = name;
    photoBooth.location = location;
    photoBooth.street_address = streetAddress;
    photoBooth.road_address = roadAddress;
    photoBooth.photo_booth_brand = brand;

    return photoBooth;
  }

  static to(
    id: string,
    {
      name,
      location,
      latitude,
      longitude,
      streetAddress,
      roadAddress,
      operationTime,
      brand,
    }: MoveToOpenBoothProps,
  ): PhotoBooth {
    const photoBooth = new PhotoBooth();

    photoBooth.id = id;
    photoBooth.name = name;
    photoBooth.latitude = latitude;
    photoBooth.location = location;
    photoBooth.longitude = longitude;
    photoBooth.road_address = roadAddress;
    photoBooth.operation_time = operationTime;
    photoBooth.street_address = streetAddress;
    photoBooth.photo_booth_brand = brand;

    return photoBooth;
  }
}
