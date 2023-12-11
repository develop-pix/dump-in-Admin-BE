import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  GetBoothBrandListDto,
  GetPhotoBoothListDto,
} from './get-photo-booth-list.dto';

export class GetPhotoBoothDetailDto extends GetPhotoBoothListDto {
  @ApiProperty({
    description: '포토부스 지점의 위도',
    example: 37.566295,
  })
  @Expose()
  get latitude(): number {
    return this._latitude;
  }

  @ApiProperty({
    description: '포토부스 지점의 경도',
    example: 126.977945,
  })
  @Expose()
  get longitude(): number {
    return this._longitude;
  }

  @ApiProperty({
    description: '포토부스의 운영 시간',
    example: '운영 시간',
  })
  @Expose()
  get operationTime(): string | null {
    return this._operation_time;
  }
}

export class GetBoothBrandDetailDto extends GetBoothBrandListDto {
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
    return this._photo_booth_url;
  }

  @ApiProperty({
    description: '포토부스의 업체 이벤트 허용 여부',
    example: true,
  })
  @Expose()
  get isEvent(): boolean {
    return this._is_event;
  }
}
