import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Hashtag } from '../entity/hashtag.entity';

export class GetHashtagListDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _description: string;

  constructor(data: Hashtag) {
    Object.keys(data).forEach((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '해시태그 id', example: 1 })
  @Expose()
  get id(): string {
    return this._id;
  }

  @ApiProperty({
    description: '해시태그 이름',
    example: '스냅',
  })
  @Expose()
  get name(): string {
    return this._name;
  }
}
