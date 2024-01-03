import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetPhotoBoothListDto } from './get-photo-booth-list.dto';

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
  get operationTime(): string {
    return this._operationTime;
  }
}
