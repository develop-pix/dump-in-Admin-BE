import { Controller, Post, Body, Session, HttpCode } from '@nestjs/common';
import { ResponseEntity } from '../common/entity/response.entity';
import { AuthService } from './auth.service';
import { SwaggerLogIn } from './decorator/swagger/login.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoginAdmin } from './dto/post-login.dto';
import { GetAdminSession } from './dto/get-admin-session.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerLogIn()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() request: LoginAdmin,
    @Session() session: Record<string, GetAdminSession>,
  ) {
    const admin = await this.authService.login(request);
    session.user = new GetAdminSession(admin);
    return ResponseEntity.OK(`${request.username}님이 로그인 했습니다.`);
  }
}
