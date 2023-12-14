import { ConfigModuleOptions } from '@nestjs/config';
import { validate } from '../env.validation';

export const envConfigOptions: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  isGlobal: true,
  validate,
};
