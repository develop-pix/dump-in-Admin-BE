import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ValidateCredentialConstraint } from './decorator/validator/validate-credential.validator';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, ValidateCredentialConstraint],
})
export class AuthModule {}
