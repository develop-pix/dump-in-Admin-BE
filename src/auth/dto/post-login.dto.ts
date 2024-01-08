import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginAdmin {
  @ApiProperty({
    description: '어드민이 로그인에 사용할 아이디 필드입니다.',
    required: true,
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  username: string;

  @ApiProperty({
    description: '어드민 로그인에 사용할 password 필드입니다.',
    required: true,
    example: 'dump-in123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  password: string;
}
