import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FindBoothOptionWhere } from '../repository/photo-booth.repository';

@Entity('photo_booth_raw_data')
export class PhotoBoothRawData extends BaseDateEntity {
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

  @Column({ type: 'timestamp' })
  preprocessed_at: Date;

  static of({ location, name }: FindBoothOptionWhere) {
    const photoBoothRaw = new PhotoBoothRawData();

    photoBoothRaw.location = location;
    photoBoothRaw.name = name;

    return photoBoothRaw;
  }
}
