import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';

@Module({
  controllers: [PhotoBoothController],
  providers: [PhotoBoothService],
})
export class PhotoBoothModule {}
