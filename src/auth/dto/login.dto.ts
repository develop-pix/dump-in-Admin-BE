import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { User } from '../../user/entity/user.entity';
import * as crypto from 'crypto';

export class LogInDto {
  @ApiProperty({
    description: '어드민이 로그인에 사용할 아이디 필드입니다.',
    required: true,
    example: 'admin',
  })
  @Expose()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  username: string;

  @ApiProperty({
    description: '어드민 로그인에 사용할 password 필드입니다.',
    required: true,
    example: 'dump-in123!',
  })
  @Expose()
  @IsNotEmpty()
  @MaxLength(30)
  password: string;

  toEntity(): User {
    const props = {
      username: this.username,
      password: this.sha256(this.password),
    };

    return User.of(props);
  }

  private sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
