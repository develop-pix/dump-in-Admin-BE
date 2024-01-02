import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repository/review.repository';
import { PhotoBoothModule } from '../photo-booth/photo-booth.module';

@Module({
  imports: [PhotoBoothModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewRepository],
})
export class ReviewModule {}
