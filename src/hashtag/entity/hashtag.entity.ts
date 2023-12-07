import { EventHashtag } from '../../event/entity/event.entity';
import { PhotoBoothHashtag } from '../../photo-booth/entity/photo-booth-brand.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  order_number: number;

  @OneToMany(
    () => PhotoBoothHashtag,
    (photoBoothHashtag: PhotoBoothHashtag) => photoBoothHashtag.hashtag,
  )
  photo_booth_hashtags: PhotoBoothHashtag[];

  @OneToMany(
    () => EventHashtag,
    (eventHashtag: EventHashtag) => eventHashtag.hashtag,
  )
  event_hashtag: EventHashtag[];

  static of({ id, name }: FindHashtagOptionsProps): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;
    hashtag.id = id;

    return hashtag;
  }

  static create({ name }: HashtagCreateProps): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;

    return hashtag;
  }
}

export interface FindHashtagOptionsProps {
  id?: number;
  name: string;
}

export interface HashtagCreateProps {
  name: string;
}
