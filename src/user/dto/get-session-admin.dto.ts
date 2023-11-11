import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export interface RawAdmin {
  userId: number;
  email: string;
  username: string;
  password: string;
  group: string;
}

export class GetSessionAdminDto {
  @Exclude() private readonly _userId: number;
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _username: string;
  @Exclude() private readonly _group: string;

  constructor(user: RawAdmin) {
    Object.keys(user).forEach((key) => (this[`_${key}`] = user[key]));
  }

  @ApiProperty({ description: '유저의 식별자 id 입니다', example: '1' })
  @Expose()
  get userId(): number {
    return this._userId;
  }

  @ApiProperty({
    description: '유저의 아이디 입니다',
    example: 'feed-me-admin1',
  })
  @Expose()
  get username(): string {
    return this._username;
  }

  @ApiProperty({
    description: '유저의 email 입니다',
    example: 'feed-me-admin1@naver.com',
  })
  @Expose()
  get email(): string {
    return this._email;
  }

  @ApiProperty({
    description: '유저가 가지고 있는 권한 이름 입니다',
    example: '2',
  })
  @Expose()
  get group(): string {
    return this._group;
  }
}
