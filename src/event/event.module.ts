import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventImage } from './entity/event-image.entity';
import { EventHashtag, Events } from './entity/event.entity';
import { EventRepository } from './repository/event.repository';
import { HashtagService } from '../hashtag/hashtag.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventImage, Events, EventHashtag])],
  controllers: [EventController],
  providers: [EventService, EventRepository, HashtagService],
})
export class EventModule {}
