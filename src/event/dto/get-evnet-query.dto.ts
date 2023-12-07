import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '../../common/dto/paginated-req.dto';

export class BoothBrandQueryDto extends PaginatedDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: false,
    example: '포토그레이',
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean = false;

  @ApiProperty({
    description: '포토부스 업체의 해시태그',
    required: false,
    example: '카페,스튜디오,이벤트',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  hashtags?: string;

  getQueryProps(): FindBrandOptionProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
      hashtags: this.hashtags
        ? this.hashtags.split(',').map((tag) => tag.trim())
        : [],
    };
  }
}

export interface FindBrandOptionProps {
  id?: number;
  name?: string;
  isEvent?: boolean;
  hashtags?: string[];
}
