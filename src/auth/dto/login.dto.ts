import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @MaxLength(30)
  password: string;
}
