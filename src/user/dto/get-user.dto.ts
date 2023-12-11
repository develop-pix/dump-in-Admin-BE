import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';
import { Review } from '../../review/entity/review.entity';

export class GetUserDto {
  @Exclude() private _id: number;
  @Exclude() private _username: string;
  @Exclude() private _nickname: string;
  @Exclude() private _email: string;
  @Exclude() private _created_at: Date;
  @Exclude() private _deleted_at: Date | null;
  @Exclude() private _reviews: Review[];

  constructor(data: User) {
    Object.keys(data).map((key) => (this[`_${key}`] = data[key]));
  }

  @ApiProperty({ description: '유저 테이블 내의 id 값' })
  @Expose()
  get id(): number {
    return this._id;
  }

  @ApiProperty({
    description: '유저의 아이디',
  })
  @Expose()
  get username(): string {
    return this._username;
  }

  @ApiProperty({
    description: '유저의 이메일',
  })
  @Expose()
  get email(): string {
    return this._email;
  }

  @ApiProperty({
    description: '유저의 닉네임',
  })
  @Expose()
  get nickname(): string {
    return this._nickname;
  }

  @ApiProperty({
    description: '유저의 탈퇴일',
  })
  @Expose()
  get deletedAt(): Date {
    return this._deleted_at;
  }

  @ApiProperty({
    description: '유저의 회원가입일',
  })
  @Expose()
  get createdAt(): Date {
    return this._created_at;
  }

  @ApiProperty({
    description: '유저가 작성한 리뷰들',
  })
  @Expose()
  @Type(() => Review)
  get review(): Review[] {
    return this._reviews;
  }
}
