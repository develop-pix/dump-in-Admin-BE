import { Controller, Get, Post, Patch } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Patch(':id')
  update() {}
}
