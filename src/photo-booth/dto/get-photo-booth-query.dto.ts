import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '../../common/dto/paginated-req.dto';

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

  getQueryProps(): FindBoothOptionProps {
    return {
      location: this.location,
      name: this.name,
    };
  }
}

export class BrandQueryDto extends PaginatedDto {
  @ApiProperty({
    description: '포토부스 업체명',
    required: true,
    example: '포토그레이',
  })
  @IsString()
  @IsOptional()
  @IsString()
  @Type(() => String)
  name: string;

  @ApiProperty({
    description: '포토부스 업체의 이벤트 허용 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEvent: boolean = false;

  getQueryProps(): FindBrandOptionProps {
    return {
      name: this.name,
      isEvent: this.isEvent,
    };
  }
}

export interface FindBrandOptionProps {
  id?: number;
  name?: string;
  isEvent?: boolean;
}

export interface FindBoothOptionProps {
  id?: string;
  name?: string;
  location?: string;
}
