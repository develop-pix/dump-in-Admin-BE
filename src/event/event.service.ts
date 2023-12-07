import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  create() {
    return 'This action adds a new event';
  }

  findAll() {
    return `This action returns all event`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number) {
    return `This action updates a #${id} event`;
  }
}
