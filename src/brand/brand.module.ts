import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { PhotoBoothBrand } from './entity/brand.entity';
import { BrandImage } from './entity/brand-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from '../hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoBoothBrand, BrandImage]),
    HashtagModule,
  ],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService],
})
export class BrandModule {}
