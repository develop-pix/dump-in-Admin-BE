import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothRawData } from '../entity/raw-data.entity';

@Injectable()
export class PhotoBoothRawRepository {
  constructor(
    @InjectRepository(PhotoBoothRawData)
    private readonly photoBoothRawRepository: Repository<PhotoBoothRawData>,
  ) {}

  async findBoothRawByOptionAndCount(): Promise<[PhotoBoothRawData[], number]> {
    return await this.photoBoothRawRepository.findAndCount();
  }
}
