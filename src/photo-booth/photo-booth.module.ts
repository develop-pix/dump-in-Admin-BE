import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoBooth } from './entity/photo-booth.entity';
import { HiddenPhotoBooth } from './entity/raw-data.entity';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-raw-data.repository';
import {
  Hashtag,
  PhotoBoothBrand,
  PhotoBoothHashtag,
} from './entity/photo-booth-brand.entity';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PhotoBooth,
      HiddenPhotoBooth,
      PhotoBoothBrand,
      PhotoBoothHashtag,
      Hashtag,
    ]),
  ],
  controllers: [PhotoBoothController],
  providers: [
    PhotoBoothService,
    PhotoBoothRepository,
    HiddenBoothRepository,
    PhotoBoothBrandRepository,
  ],
})
export class PhotoBoothModule {}
