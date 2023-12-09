import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ApiTags } from '@nestjs/swagger';
import { ReviewQueryDto } from './dto/get-review-query.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { GetReviewListDto } from './dto/get-review-list.dto';
import { Page } from '../common/dto/pagination-res.dto';
import { GetReviewDetailDto } from './dto/get-review-detail.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';

@ApiTags('리뷰')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @SwaggerAPI({
    name: '리뷰 목록 조회',
    response: GetReviewListDto,
    isArray: true,
  })
  async findReviewByQueryParam(
    @Query() request: ReviewQueryDto,
  ): Promise<ResponseEntity<Page<GetReviewListDto>>> {
    const [response, count] = await this.reviewService.findReviewByQueryParam(
      request.getPageProps(),
      request.getQueryProps(),
    );
    return ResponseEntity.OK_WITH<Page<GetReviewListDto>>(
      '리뷰 목록을 조회합니다.',
      Page.create(request.getPageProps(), count, response),
    );
  }

  @Get(':id')
  @SwaggerAPI({
    name: '리뷰 정보 조회',
    response: GetReviewDetailDto,
  })
  async findOneReviewById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<GetReviewDetailDto>> {
    const response = await this.reviewService.findOneReviewById(id);
    return ResponseEntity.OK_WITH<GetReviewDetailDto>(
      '요청한 이벤트 정보를 조회합니다.',
      new GetReviewDetailDto(response),
    );
  }

  @Delete(':id')
  @SwaggerAPI({
    name: '리뷰 삭제',
  })
  async removeReview(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseEntity<string>> {
    await this.reviewService.removeReview(id);
    return ResponseEntity.OK('리뷰를 삭제 했습니다.');
  }
}