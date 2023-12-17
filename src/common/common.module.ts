// common/common.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  consoleTransport,
  errorLogFileTransport,
  infoLogFileTransport,
} from './config/winston.config';
import { envConfigOptions } from './config/env.config';
import { Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    WinstonModule.forRoot({
      transports: [
        consoleTransport,
        infoLogFileTransport,
        errorLogFileTransport,
      ],
    }),
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [ConfigModule, WinstonModule, Logger],
})
export class CommonModule {}
