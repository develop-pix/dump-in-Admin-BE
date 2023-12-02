import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FindBoothOptionWhere } from '../dto/get-photo-booth-query.dto';

@Entity('photo_booth_raw_data')
export class HiddenPhotoBooth extends BaseDateEntity {
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

  @Column({ type: 'timestamp', nullable: true })
  preprocessed_at: Date;

  static of({ location, name }: FindBoothOptionWhere) {
    const hiddenBooth = new HiddenPhotoBooth();

    hiddenBooth.location = location;
    hiddenBooth.name = name;

    return hiddenBooth;
  }

  static byId({ id }: FindBoothOptionWhere) {
    const hiddenBooth = new HiddenPhotoBooth();

    hiddenBooth.id = id;

    return hiddenBooth;
  }

  // static updateBy({
  //   name,
  //   location,
  //   street_address,
  //   road_address,
  // }: PhotoBoothUpdateProps): PhotoBooth {
  //   const photoBoothRaw = new PhotoBoothRawData();

  //   photoBooth.name = name;
  //   photoBooth.location = location;
  //   photoBooth.street_address = street_address;
  //   photoBooth.road_address = road_address;

  //   return photoBooth;
  // }
}
