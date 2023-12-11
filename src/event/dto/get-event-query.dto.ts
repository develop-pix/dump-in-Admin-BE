import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { PhotoBoothBrand } from '../../photo-booth/entity/photo-booth-brand.entity';
import { EventReqBodyProps } from './req-event-body.dto';
import { PaginationDto } from '../../common/dto/pagination-req.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EventQueryDto extends PaginationDto {
  @ApiProperty({
    description: '이벤트와 관련된 포토부스 업체명',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @IsOptional()
  brandName: string;

  @ApiProperty({
    description: '이벤트의 제목',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Type(() => String)
  @IsOptional()
  title: string;

  getQueryProps(): FindEventOptionProps {
    return {
      brandName: this.brandName,
      title: this.title,
    };
  }
}

export interface FindEventOptionProps
  extends Pick<Partial<EventReqBodyProps>, 'brandName' | 'title'> {
  brand?: PhotoBoothBrand;
}
