import { Module } from '@nestjs/common';
import { PhotoBoothModule } from './photo-booth/photo-booth.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './event/event.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { typeOrmConfig } from './common/config/typeorm.config';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    PhotoBoothModule,
    EventModule,
    UserModule,
    AuthModule,
    HashtagModule,
    ReviewModule,
    DashboardModule,
  ],
})
export class AppModule {}
