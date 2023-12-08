import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { Events } from '../../event/entity/event.entity';

@Entity('event_hashtag')
export class EventHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Events, (photoBoothBrand: Events) => photoBoothBrand.events)
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.event_hashtag, {
    eager: true,
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of(event: Events): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.event = event;

    return eventHashtag;
  }

  static create(event: Events, hashtag: Hashtag): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.event = new Events();
    eventHashtag.hashtag = new Hashtag();

    eventHashtag.event = event;
    eventHashtag.hashtag = hashtag;

    return eventHashtag;
  }
}
