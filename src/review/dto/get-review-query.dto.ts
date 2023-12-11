import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';

export class ReviewQueryDto extends PaginationDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: false,
    example: '하루필름',
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  boothName: string;

  @ApiProperty({
    description: '리뷰를 작성한 유저닉네임',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  userName: string;

  getQueryProps(): FindReviewOptionsProps {
    return {
      boothName: this.decodeString(this.boothName),
      userName: this.decodeString(this.userName),
    };
  }
}

export interface FindReviewOptionsProps {
  boothName: string;
  userName: string;
}
