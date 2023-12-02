import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '../../common/dto/paginated-req.dto';

export interface FindBoothOptionWhere {
  id?: string;
  name?: string;
  location?: string;
}

export class BoothQueryDto extends PaginatedDto {
  @ApiProperty({
    description: '포토부스에서 지역을 검색하는 쿼리스트링',
    example: '서울',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  location?: string;

  @ApiProperty({
    description: '포토부스에서 지점명을 검색하는 쿼리스트링',
    example: '하루필름 홍대 1호점',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  name?: string;

  getQueryProps(): FindBoothOptionWhere {
    return {
      location: this.location,
      name: this.name,
    };
  }
}
