import { ConfigModuleOptions } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateSync } from 'class-validator';

export const envConfigOptions: ConfigModuleOptions = {
  envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
  isGlobal: true,
  validate,
};

enum Environment {
  Local = 'local',
  Production = 'production',
  Dev = 'dev',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  ALLOWED_ORIGINS: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASS: string;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  APP_SERVER_PORT: string;

  @IsString()
  DATABASE_PORT: string;

  @IsString()
  SET_COOKIE_SECRET: string;
}

function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
