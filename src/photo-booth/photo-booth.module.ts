import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PhotoBoothRawData } from './entity/raw-data.entity';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';
import {
  Category,
  PhotoBoothBrand,
  PhotoBoothCategory,
} from './entity/photo-booth-brand.entity';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PhotoBooth,
      PhotoBoothRawData,
      PhotoBoothBrand,
      PhotoBoothCategory,
      Category,
    ]),
  ],
  controllers: [PhotoBoothController],
  providers: [
    PhotoBoothService,
    PhotoBoothRepository,
    PhotoBoothRawRepository,
    PhotoBoothBrandRepository,
  ],
})
export class PhotoBoothModule {}
