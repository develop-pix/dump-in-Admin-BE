import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PhotoBoothBrand } from './photo-booth-brand.entity';
import { FindBoothOptionProps } from '../dto/get-photo-booth-query.dto';
import { PhotoBoothUpdateProps } from '../dto/patch-photo-booth.dto';
import { MoveToOpenBoothProps } from '../dto/put-photo-booth.dto';
import { Review } from '../../review/entity/review.entity';

@Entity('photo_booth')
export class PhotoBooth extends BaseDateEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  latitude: number;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  longitude: number;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column({ name: 'road_address' })
  roadAddress: string;

  @Column({ name: 'operation_time' })
  operationTime: string;

  @Column({ name: 'like_count' })
  likeCount: number;

  @Column({ name: 'view_count' })
  viewCount: number;

  @OneToMany(() => Review, (review) => review.photoBooth)
  reviews: Review[];

  @ManyToOne(
    () => PhotoBoothBrand,
    (photoBoothBrand: PhotoBoothBrand) => photoBoothBrand.photoBooths,
  )
  @JoinColumn({ name: 'photo_booth_brand_id' })
  photoBoothBrand: PhotoBoothBrand;

  static byId(id: string) {
    const photoBooth = new PhotoBooth();

    photoBooth.id = id;

    return photoBooth;
  }

  static byName(name: string) {
    const photoBooth = new PhotoBooth();

    photoBooth.name = name;

    return photoBooth;
  }

  static of({ location, name, brandName }: FindBoothOptionProps) {
    const photoBooth = new PhotoBooth();

    photoBooth.location = location;
    photoBooth.name = name;
    photoBooth.photoBoothBrand = PhotoBoothBrand.byName(brandName);

    return photoBooth;
  }

  static updateBy({
    name,
    location,
    streetAddress,
    roadAddress,
    brandName,
  }: PhotoBoothUpdateProps): PhotoBooth {
    const photoBooth = new PhotoBooth();

    photoBooth.name = name;
    photoBooth.location = location;
    photoBooth.streetAddress = streetAddress;
    photoBooth.roadAddress = roadAddress;
    photoBooth.photoBoothBrand = PhotoBoothBrand.byName(brandName);

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
      brandName,
    }: MoveToOpenBoothProps,
  ): PhotoBooth {
    const photoBooth = new PhotoBooth();

    photoBooth.id = id;
    photoBooth.name = name;
    photoBooth.latitude = latitude;
    photoBooth.location = location;
    photoBooth.longitude = longitude;
    photoBooth.roadAddress = roadAddress;
    photoBooth.operationTime = operationTime;
    photoBooth.streetAddress = streetAddress;
    photoBooth.photoBoothBrand = PhotoBoothBrand.byName(brandName);

    return photoBooth;
  }
}
