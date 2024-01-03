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
    (brandHashtag: BrandHashtag) => brandHashtag.hashtag,
  )
  brandhashtags: BrandHashtag[];

  @OneToMany(
    () => EventHashtag,
    (eventHashtag: EventHashtag) => eventHashtag.hashtag,
  )
  eventHashtags: EventHashtag[];

  static byName(name: string): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;

    return hashtag;
  }

  static create(name: string): Hashtag {
    const hashtag = new Hashtag();

    hashtag.name = name;

    return hashtag;
  }

  static unique(hashtags: string[]): Hashtag[] {
    return [...new Set(hashtags)].map((name) => Hashtag.byName(name));
  }
}
