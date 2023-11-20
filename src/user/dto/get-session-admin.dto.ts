import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class GetSessionAdminDto {
  @Exclude() private readonly _email: string;
  @Exclude() private readonly _username: string;
  @Exclude() private readonly _isAdmin: boolean;

  constructor(user: RawAdmin) {
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

export class RawAdmin {
  email: string;
  username: string;
  password: string;
  is_admin: boolean;

  constructor(user: User) {
    Object.keys(user).forEach((key) => (this[`${key}`] = user[key]));
  }

  get isAdmin(): boolean {
    return this.is_admin;
  }
}

export class SessionAdminInfo extends PickType(RawAdmin, [
  'username',
  'email',
  'isAdmin',
]) { }
