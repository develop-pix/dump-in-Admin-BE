import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './repository/review.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewImage } from './entity/review-image.entity';
import { Concept, ReviewConcept } from './entity/review-concept.entity';
import { Review } from './entity/review.entity';
import { PhotoBoothModule } from '../photo-booth/photo-booth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewImage, ReviewConcept, Concept]),
    PhotoBoothModule,
    UserModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
