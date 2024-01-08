import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { HashtagModule } from '../hashtag/hashtag.module';
import { BrandRepository } from './repository/brand.repository';

@Module({
  imports: [HashtagModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
