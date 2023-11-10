import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  async validate(username: string, password: string, done: CallableFunction): Promise<any> {
    const user = await this.authService.validateAdminUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return done(null, user);
  }
}