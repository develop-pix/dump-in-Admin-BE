import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBooth } from '../entity/photo-booth.entity';

@Injectable()
export class PhotoBoothRepository {
  constructor(
    @InjectRepository(PhotoBooth)
    private readonly photoBoothRepository: Repository<PhotoBooth>,
  ) {}

  async isExist(data: PhotoBooth): Promise<boolean> {
    return await this.photoBoothRepository.exist();
  }
}
