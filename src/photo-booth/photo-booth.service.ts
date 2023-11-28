import { Injectable } from '@nestjs/common';

@Injectable()
export class PhotoBoothService {
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

  findAllRawData() {
    return `This action returns all photoBooth`;
  }

  findOneRawData(id: number) {
    return `This action returns a #${id} photoBooth`;
  }

  updateRawData(id: number) {
    return `This action updates a #${id} photoBooth`;
  }

  removeRawData(id: number) {
    return `This action removes a #${id} photoBooth`;
  }
}
