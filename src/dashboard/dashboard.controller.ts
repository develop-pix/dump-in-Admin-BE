import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { GetStatisticsDto } from './dto/get-statistics.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerAPI } from '../common/swagger/api.decorator';

@ApiTags('대시보드')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @SwaggerAPI({
    name: '날짜별 리뷰수, 가입자수 조회',
    model: GetStatisticsDto,
  })
  async combineResultsByDate(): Promise<ResponseEntity<GetStatisticsDto[]>> {
    const response = await this.dashboardService.combineResultsByDate();
    return ResponseEntity.OK_WITH('날짜별 리뷰수, 가입자수 입니다.', response);
  }

  @Get('user')
  @SwaggerAPI({
    name: '날짜별 가입 유저수 조회',
    model: GetStatisticsDto,
  })
  async countUsersByDate(): Promise<ResponseEntity<GetStatisticsDto[]>> {
    const response = await this.dashboardService.countUsersByDate();
    return ResponseEntity.OK_WITH('날짜별 유저수 입니다.', response);
  }

  @Get('review')
  @SwaggerAPI({
    name: '날짜별 생성 리뷰수 조회',
    model: GetStatisticsDto,
  })
  async countReviewsByDate(): Promise<ResponseEntity<GetStatisticsDto[]>> {
    const response = await this.dashboardService.countReviewsByDate();
    return ResponseEntity.OK_WITH('날짜별 리뷰수 입니다.', response);
  }
}
