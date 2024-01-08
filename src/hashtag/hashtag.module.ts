import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { HashtagController } from './hashtag.controller';
import { HashtagRepository } from './repository/hastag.repository';
import { BrandHashtagRepository } from './repository/brand-hashtag.repository';
import { EventHashtagRepository } from './repository/event-hashtag.repository';

@Module({
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
