import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hashtag } from '../../hashtag/entity/hashtag.entity';
import { Events } from '../../event/entity/event.entity';

@Entity('event_hashtag')
export class EventHashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Events, (event: Events) => event.eventHashtags, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'event_id' })
  event: Events;

  @ManyToOne(() => Hashtag, (hashtag: Hashtag) => hashtag.eventHashtags, {
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;

  static of(event: Events): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.event = event;

    return eventHashtag;
  }

  static create(hashtag: Hashtag): EventHashtag {
    const eventHashtag = new EventHashtag();

    eventHashtag.hashtag = hashtag;

    return eventHashtag;
  }
}
