import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { HashtagModule } from '../hashtag/hashtag.module';
import { EventRepository } from './repository/event.repository';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [HashtagModule, BrandModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
