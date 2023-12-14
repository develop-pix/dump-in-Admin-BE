import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class GetAdminSessionDto {
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _username: string;
  @Exclude() private readonly _isAdmin: boolean;

  constructor(user: User) {
    this._email = user.email;
    this._username = user.username;
    this._isAdmin = user.isAdmin;
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
  get isAdmin(): boolean {
    return this._isAdmin;
  }
}
