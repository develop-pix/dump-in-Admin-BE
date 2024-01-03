// import { Injectable } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  isString,
  maxLength,
  minLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AuthService } from '../auth.service';

@Injectable()
@ValidatorConstraint({ name: 'credential', async: true })
export class ValidateCredentialConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly authService: AuthService) {}

  async validate(_: unknown, { object, property }: ValidationArguments) {
    if (!this.hasCredentials(object)) return true;

    if (!(await this.authService.verifyCredentials(object, property))) {
      throw new UnauthorizedException(`${property}가 일치하지 않습니다.`);
    }

    return true;
  }

  private hasCredentials(object: object): object is {
    username: string;
    password: string;
  } {
    const { password, username } = object as Record<string, unknown>;
    const isValidPassword =
      isString(password) && minLength(password, 4) && maxLength(password, 32);
    const isValidUsername = isString(username) && maxLength(username, 32);

    if (isValidPassword) return true;
    if (isValidPassword && isValidUsername) return true;

    return false;
  }
}

export function ValidateCredential(options: ValidationOptions = {}) {
  return function (object: object, propertyName: 'username' | 'password') {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: ValidateCredentialConstraint,
    });
  };
}
