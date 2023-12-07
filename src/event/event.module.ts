import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventImage } from './entity/event-image.entity';
import { Events } from './entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventImage, Events])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
