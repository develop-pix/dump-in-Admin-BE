import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination-req.dto';
import { PhotoBooth } from '../../photo-booth/entity/photo-booth.entity';
import { User } from '../../user/entity/user.entity';

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
  boothName?: string;

  @ApiProperty({
    description: '리뷰를 작성한 유저닉네임',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  userName?: string;

  getQueryProps(): FindReviewOptionsProps {
    return {
      boothName: this.boothName,
      userName: this.userName,
    };
  }
}

export interface FindReviewOptionsProps {
  boothName?: string;
  photoBooth?: PhotoBooth;
  userName?: string;
  user?: User;
}
