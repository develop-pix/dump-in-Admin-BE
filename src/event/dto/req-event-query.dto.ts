import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PaginationDto } from '../../common/dto/get-pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FindEventOptionProps } from '../event.interface';

export class EventQueryParam extends PaginationDto {
  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsOptional()
  brandName: string;

  @ApiProperty({
    description: '이벤트의 제목',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @Type(() => String)
  @IsOptional()
  title: string;

  getQueryProps(): FindEventOptionProps {
    return {
      brandName: this.decodeString(this.brandName),
      title: this.decodeString(this.title),
    };
  }
}
