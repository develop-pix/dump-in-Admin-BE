import { Controller, Get, Post } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('해시태그')
@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}
}
