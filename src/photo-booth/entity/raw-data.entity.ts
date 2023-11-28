import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('photo_booth_raw_data')
export class PhotoBoothRawData extends BaseDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  photo_booth_raw_data_id: number;

  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  latitude: number;

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  longitude: number;

  @Column({ type: 'varchar', length: 64 })
  address: string;

  @Column({ type: 'varchar', length: 64 })
  road_address: string;

  @Column({ type: 'varchar', length: 64 })
  operation_time: string;

  @Column({ type: 'varchar', length: 128 })
  home_page: string;

  @Column({ type: 'varchar', length: 128 })
  category: string;

  @Column({ type: 'timestamp' })
  deleted_at: Date;

  static softDelete() {
    const photoBoothRaw = new PhotoBoothRawData();
    photoBoothRaw.deleted_at = new Date();
    return photoBoothRaw;
  }
}
