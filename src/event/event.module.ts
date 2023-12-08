import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventImage } from './entity/event-image.entity';
import { Events } from './entity/event.entity';
import { HashtagModule } from '../hashtag/hashtag.module';
import { PhotoBoothModule } from 'src/photo-booth/photo-booth.module';
import { EventRepository } from './repository/event.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventImage, Events]),
    HashtagModule,
    PhotoBoothModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
