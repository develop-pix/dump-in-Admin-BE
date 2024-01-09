import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { BrandModule } from '../brand/brand.module';

@Module({
  imports: [BrandModule],
  controllers: [PhotoBoothController],
  providers: [PhotoBoothService, PhotoBoothRepository, HiddenBoothRepository],
  exports: [PhotoBoothService],
})
export class PhotoBoothModule {}
