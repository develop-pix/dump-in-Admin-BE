import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoBoothService {
  create() {
    return 'This action adds a new photoBooth';
  }

  findAll() {
    return `This action returns all photoBooth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photoBooth`;
  }

  update(id: number) {
    return `This action updates a #${id} photoBooth`;
  }

  remove(id: number) {
    return `This action removes a #${id} photoBooth`;
  }
}