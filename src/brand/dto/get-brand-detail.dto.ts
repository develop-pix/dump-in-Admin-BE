import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetBrandList } from './get-brand-list.dto';

export class GetBrandDetail extends GetBrandList {
  @ApiProperty({
    description: '포토부스의 업체 설명',
  })
  @Expose()
  get description(): string | null {
    return this._description;
  }

  @ApiProperty({
    description: '포토부스의 업체 관련 홈페이지 주소',
  })
  @Expose()
  get photoBoothUrl(): string | null {
    return this._photoBoothUrl;
  }

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
    example: true,
  })
  @Expose()
  get isEvent(): boolean {
    return this._isEvent;
  }

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
  })
  @Expose()
  get images(): string[] {
    return this._brandImages.map((images) => images.brandImageUrl);
  }
}
