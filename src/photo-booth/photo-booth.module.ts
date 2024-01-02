import { Module } from '@nestjs/common';
import { PhotoBoothService } from './photo-booth.service';
import { PhotoBoothController } from './photo-booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoBooth } from './entity/photo-booth.entity';
import { HiddenPhotoBooth } from './entity/photo-booth-hidden.entity';
import { PhotoBoothRepository } from './repository/photo-booth.repository';
import { HiddenBoothRepository } from './repository/photo-booth-hidden.repository';
import { HashtagModule } from '../hashtag/hashtag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoBooth, HiddenPhotoBooth]),
    HashtagModule,
  ],
  controllers: [PhotoBoothController],
  providers: [PhotoBoothService, PhotoBoothRepository, HiddenBoothRepository],
  exports: [PhotoBoothService],
})
export class PhotoBoothModule {}
