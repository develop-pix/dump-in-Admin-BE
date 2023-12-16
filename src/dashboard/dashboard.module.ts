import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [UserModule, ReviewModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
