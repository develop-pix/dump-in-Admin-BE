import { Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ResponseEntity } from '../common/entity/response.entity';
import { CookieAuthGuard } from './guard/cookie-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private logger: Logger) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login() {
    return ResponseEntity.OK('로그인에 성공했습니다.');
  }

  @UseGuards(CookieAuthGuard)
  @Post('logout')
  logOut(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      req.session.destroy(() => res.redirect("/"))
      if (err) {
        this.logger.error(err.stack)
      }
    });
    return ResponseEntity.OK('로그아웃에 성공했습니다.');
  }
}