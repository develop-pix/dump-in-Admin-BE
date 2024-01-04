import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { Statistics } from './dto/get-statistics.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerAPI } from '../common/swagger/api.decorator';

@ApiTags('대시보드')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @SwaggerAPI({
    name: '날짜별 리뷰수, 가입자수 조회',
    model: Statistics,
  })
  async combineResultsByDate(): Promise<ResponseEntity<Statistics[]>> {
    const response = await this.dashboardService.combineResultsByDate();
    return ResponseEntity.OK_WITH(
      '날짜별 리뷰수, 가입자수 입니다.',
      Statistics.list(response),
    );
  }

  @Get('user')
  @SwaggerAPI({
    name: '날짜별 가입 유저수 조회',
    model: Statistics,
  })
  async countUsersByDate(): Promise<ResponseEntity<Statistics[]>> {
    const response = await this.dashboardService.countUsersByDate();
    return ResponseEntity.OK_WITH(
      '날짜별 유저수 입니다.',
      Statistics.list(response),
    );
  }

  @Get('review')
  @SwaggerAPI({
    name: '날짜별 생성 리뷰수 조회',
    model: Statistics,
  })
  async countReviewsByDate(): Promise<ResponseEntity<Statistics[]>> {
    const response = await this.dashboardService.countReviewsByDate();
    return ResponseEntity.OK_WITH(
      '날짜별 리뷰수 입니다.',
      Statistics.list(response),
    );
  }
}
