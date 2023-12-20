import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from './entity/hashtag.entity';
import { HashtagRepository } from './repository/hastag.repository';
import { BrandHashtagRepository } from './repository/brand-hashtag.repository';
import { EventHashtagRepository } from './repository/event-hashtag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag])],
  controllers: [HashtagController],
  providers: [
    HashtagService,
    HashtagRepository,
    BrandHashtagRepository,
    EventHashtagRepository,
  ],
  exports: [HashtagService],
})
export class HashtagModule {}
