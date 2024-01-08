import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import { FindBrandOptionProps } from '../brand.interface';

export class BrandQueryParam extends PaginationDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: false,
    example: '포토그레이',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsOptional()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean;

  getQueryProps(): FindBrandOptionProps {
    return {
      name: this.decodeString(this.name),
      isEvent: this.isEvent,
    };
  }
}
