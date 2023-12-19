import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { FindBoothOptionProps } from '../dto/get-photo-booth-query.dto';

@Entity('photo_booth_raw_data')
export class HiddenPhotoBooth extends BaseDateEntity {
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

  @Column({ name: 'preprocessed_at' })
  preprocessedAt: Date;

  static of({ location, name }: FindBoothOptionProps): HiddenPhotoBooth {
    const hiddenBooth = new HiddenPhotoBooth();

    hiddenBooth.location = location;
    hiddenBooth.name = name;

    return hiddenBooth;
  }

  static byId(id: string): HiddenPhotoBooth {
    const hiddenBooth = new HiddenPhotoBooth();

    hiddenBooth.id = id;

    return hiddenBooth;
  }
}
