import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';
import { Review } from '../../review/entity/review.entity';

export class GetUserDto {
  @Exclude() readonly _id: number;
  @Exclude() readonly _username: string;
  @Exclude() readonly _nickname: string;
  @Exclude() readonly _email: string;
  @Exclude() readonly _createdAt: Date;
  @Exclude() readonly _deletedAt: Date | null;
  @Exclude() readonly _reviews: Review[];

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
    return this._deletedAt;
  }

  @ApiProperty({
    description: '유저의 회원가입일',
  })
  @Expose()
  get createdAt(): Date {
    return this._createdAt;
  }

  @ApiProperty({
    description: '유저가 작성한 리뷰들',
  })
  @Expose()
  get review(): number {
    return this._reviews.length;
  }
}
