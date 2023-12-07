import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '../../common/dto/paginated-req.dto';

export class BoothBrandQueryDto extends PaginatedDto {
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
  brandName?: string;
  title?: string;
}
