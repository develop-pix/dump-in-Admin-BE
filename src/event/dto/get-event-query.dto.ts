import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination-req.dto';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';

export class EventQueryDto extends PaginationDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: false,
    example: '하루필름',
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  brandName?: string;

  @ApiProperty({
    description: '이벤트의 제목',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  title?: string;

  getQueryProps(): FindEventOptionProps {
    return {
      brandName: this.brandName,
      title: this.title,
    };
  }
}

export interface FindEventOptionProps {
  brand?: PhotoBoothBrand;
  brandName?: string;
  title?: string;
}
