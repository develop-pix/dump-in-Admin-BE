import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalSerializer } from './local.serializer';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CookieAuthGuard } from './guard/cookie-auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieAuthGuard,
    LocalAuthGuard,
    LocalStrategy,
    LocalSerializer,
    Logger,
  ],
  exports: [AuthService, UserModule],
})
export class AuthModule {}
