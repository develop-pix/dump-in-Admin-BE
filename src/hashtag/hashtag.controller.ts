import { Body, Controller, Get, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ApiTags } from '@nestjs/swagger';
import { GetHashtagListDto } from './dto/get-hastag-list.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { CreateHashtagsDto } from './dto/post-hashtag.dto';
import { SwaggerAPI } from '../common/swagger/api.decorator';

@ApiTags('해시태그')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @SwaggerAPI({
    name: '해시태그 목록 조회',
    response: GetHashtagListDto,
    isArray: true,
  })
  async findAllHashtags(): Promise<ResponseEntity<GetHashtagListDto[]>> {
    const response = await this.hashtagService.findAllHashtags();

    return ResponseEntity.OK_WITH<GetHashtagListDto[]>(
      '해시태그 목록입니다.',
      response.map((hashtag) => new GetHashtagListDto(hashtag)),
    );
  }

  @Post()
  @SwaggerAPI({ name: '해시태그 생성', status: 201 })
  async createHastags(
    @Body() request: CreateHashtagsDto,
  ): Promise<ResponseEntity<string>> {
    await this.hashtagService.createHashtags(request.getCreateProps());
    return ResponseEntity.CREATED('해시태그를 생성했습니다.');
  }
}
