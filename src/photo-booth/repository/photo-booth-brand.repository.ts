import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

@Injectable()
export class PhotoBoothBrandRepository {
  constructor(
    @InjectRepository(PhotoBoothBrand)
    private readonly photoBoothBrandRepository: Repository<PhotoBoothBrand>,
  ) {}
}
