import {
  Controller,
  Post,
  Body,
  Session,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ResponseEntity } from '../common/entity/response.entity';
import { AuthService } from './auth.service';
import { SwaggerLogIn } from './decorator/swagger/login.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerLogOut } from './decorator/swagger/logout.decorator';
import { LogInDto } from './dto/login.dto';
import { Response } from 'express';
import { LoggedCheckGuard } from './guard/logged-check.guard';
import { SessionAdminInfo } from '../user/dto/get-session-admin.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @SwaggerLogIn()
  @UseGuards(LoggedCheckGuard)
  @Post('login')
  async logIn(
    @Body() dto: LogInDto,
    @Session() session: Record<string, SessionAdminInfo>,
  ) {
    const sessionUser = await this.authService.logInAndSetSession(
      dto.toEntity(),
      session,
    );
    return ResponseEntity.OK(`${sessionUser.username}님이 로그인 했습니다.`);
  }

  @SwaggerLogOut()
  @UseGuards(LoggedCheckGuard)
  @Post('logout')
  logOut(@Res() res: Response) {
    this.authService.logOut(res);
  }
}
