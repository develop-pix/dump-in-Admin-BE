import { ArrayMaxSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Hashtag } from '../entity/hashtag.entity';

export class CreateHashtagsDto {
  @ApiProperty({
    description: '해시태그 목록',
    example: ['행사', '웨딩', '파티', '스냅'],
  })
  @IsArray()
  @ArrayMaxSize(5, { message: '해시태그는 최대 5개까지 입력 가능합니다.' })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  hashtags: string[];

  toCreateEntity(): Hashtag[] {
    return [...new Set(this.hashtags)].map((name) => Hashtag.byName(name));
  }
}
