import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothRawData } from '../entity/raw-data.entity';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

@Injectable()
export class PhotoBoothRawRepository {
  constructor(
    @InjectRepository(PhotoBoothRawData)
    private readonly photoBoothRawRepository: Repository<PhotoBoothRawData>,
    @InjectRepository(PhotoBoothBrand)
    private readonly photoBoothBrandRepository: Repository<PhotoBoothBrand>,
  ) { }

  async findBy(data: PhotoBoothRawData): Promise<PhotoBoothRawData[]> {
    return await this.photoBoothRawRepository.find();
  }

  // async findPhotoBoothRawBy(data: PhotoBoothRawData): Promise<PhotoBoothRawData> {
  //   return await this.photoBoothRawRepository.findOne();
  // }

  async updateRawToApp(userId: number, data: PhotoBoothRawData): Promise<boolean> {
    const result = await this.photoBoothRawRepository.update({ photo_booth_raw_data_id: userId }, data);
    return result.affected > 0;
  }

  private getFindPhotoBoothOptionsWhere(data: PhotoBoothRawData) {
    return;
  }
}
