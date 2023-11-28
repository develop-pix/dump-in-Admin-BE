import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoBooth } from './entity/photo-booth.entity';
import { PhotoBoothRawData } from './entity/raw-data.entity';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { PhotoBoothRawRepository } from './repository/photo-booth-raw-data.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoBooth, PhotoBoothRawData])],
  controllers: [
    PhotoBoothController,
    PhotoBoothRepository,
    PhotoBoothRawRepository,
  ],
  providers: [PhotoBoothService],
})
export class PhotoBoothModule {}
