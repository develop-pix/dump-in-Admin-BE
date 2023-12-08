import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoBooth } from './entity/photo-booth.entity';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { PhotoBoothBrand } from './entity/photo-booth-brand.entity';
import { PhotoBoothBrandRepository } from './repository/photo-booth-brand.repository';
import { HashtagModule } from '../hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoBooth, PhotoBoothBrand, HiddenPhotoBooth]),
    HashtagModule,
  ],
  controllers: [PhotoBoothController],
  providers: [
    PhotoBoothService,
    PhotoBoothRepository,
    HiddenBoothRepository,
    PhotoBoothBrandRepository,
  ],
  exports: [PhotoBoothService],
})
export class PhotoBoothModule {}
