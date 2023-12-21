import { ValidationPipeOptions } from '@nestjs/common';

export const pipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
};
