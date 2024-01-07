import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHashtagList } from './dto/get-hastag-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { CreateHashtags } from './dto/post-hashtag.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';

@ApiTags('해시태그')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @SwaggerAPI({
    name: '해시태그 목록 조회',
    model: GetHashtagList,
    isPagination: true,
  })
  async findAllHashtags(
    @Query() request: PaginationDto,
  ): Promise<ResponseEntity<PageEntity<GetHashtagList>>> {
    const [response, count] = await this.hashtagService.findAllHashtags(
      request.getPageProps(),
    );

    return ResponseEntity.OK_WITH<PageEntity<GetHashtagList>>(
      '해시태그 목록입니다.',
      PageEntity.create(
        request.getPageProps(),
        count,
        response.map((hashtag) => new GetHashtagList(hashtag)),
      ),
    );
  }

  @Post()
  @SwaggerAPI({ name: '해시태그 생성', success: 201 })
  async createHashtags(
    @Body() request: CreateHashtags,
  ): Promise<ResponseEntity<string>> {
    await this.hashtagService.createHashtags(request.toCreateEntity());
    return ResponseEntity.CREATED('해시태그를 생성했습니다.');
  }
}
