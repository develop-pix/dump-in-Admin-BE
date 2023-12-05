import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginatedDto } from '../../common/dto/paginated-req.dto';
import { PhotoBoothBrand } from '../entity/photo-booth-brand.entity';

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

  @ApiProperty({
    description: '포토부스에서 업체명을 검색하는 쿼리스트링',
    example: '하루필름',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  brandName?: string;

  getQueryProps(): FindBoothOptionProps {
    return {
      location: this.location,
      name: this.name,
      brandName: this.brandName,
    };
  }
}

export class BoothBrandQueryDto extends PaginatedDto {
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

  @ApiProperty({
    description: '포토부스 업체의 해시태그',
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

export interface FindBoothOptionProps {
  id?: string;
  name?: string;
  location?: string;
  brandName?: string;
  brand?: PhotoBoothBrand;
}
