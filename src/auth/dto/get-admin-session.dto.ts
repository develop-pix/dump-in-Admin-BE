import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entity/user.entity';

export class GetAdminSessionDto {
  @ApiProperty({
    description: '유저의 email 입니다',
    example: 'feed-me-admin1@naver.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: '유저의 아이디 입니다',
    example: 'feed-me-admin1',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: '유저가 가지고 있는 권한 입니다',
    example: true,
  })
  @Expose()
  isAdmin: boolean;

  constructor(user: User) {
    this.email = user.email;
    this.username = user.username;
    this.isAdmin = user.isAdmin;
  }
}
