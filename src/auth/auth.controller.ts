import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ResponseEntity } from '../common/entity/response.entity';
import { CookieAuthGuard } from './guard/cookie-auth.guard';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SwaggerLogIn } from './decorator/swagger/login.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerLogOut } from './decorator/swagger/logout.decorator';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerLogIn()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() req: Request) {
    return ResponseEntity.OK(`${req.body.username}님이 로그인 했습니다.`);
  }

  @SwaggerLogOut()
  @UseGuards(CookieAuthGuard)
  @Post('logout')
  logOut(@Req() req: Request) {
    this.authService.logOut(req);
    return ResponseEntity.OK(`${req.body.username}님이 로그아웃 했습니다.`);
  }
}
