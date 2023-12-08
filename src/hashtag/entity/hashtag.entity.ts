import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventHashtag } from './event-hashtag.entity';
import { BrandHashtag } from './brand-hashtag.entity';

@Entity('hashtag')
export class Hashtag {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  description: string;

  @OneToMany(
    () => BrandHashtag,
    (photoBoothHashtag: BrandHashtag) => photoBoothHashtag.hashtag,
  )
  photo_booth_hashtags: BrandHashtag[];

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
