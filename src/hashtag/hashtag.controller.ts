import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHashtagListDto } from './dto/get-hastag-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { CreateHashtagsDto } from './dto/post-hashtag.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { PaginationDto } from 'src/common/dto/get-pagination-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';

@ApiTags('해시태그')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @SwaggerAPI({
    name: '해시태그 목록 조회',
    model: GetHashtagListDto,
    isPagination: true,
  })
  async findAllHashtags(
    @Query() request: PaginationDto,
  ): Promise<ResponseEntity<PageEntity<GetHashtagListDto>>> {
    const [response, count] = await this.hashtagService.findAllHashtags(
      request.getPageProps(),
    );

    return ResponseEntity.OK_WITH<PageEntity<GetHashtagListDto>>(
      '해시태그 목록입니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((hashtag) => new GetHashtagListDto(hashtag)),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '해시태그 생성', success: 201 })
  async createHastags(
    @Body() request: CreateHashtagsDto,
  ): Promise<ResponseEntity<string>> {
    await this.hashtagService.createHashtags(request.toCreateEntity());
    return ResponseEntity.CREATED('해시태그를 생성했습니다.');
  }
}
