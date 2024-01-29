import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  consoleTransport,
  errorLogFileTransport,
  infoLogFileTransport,
} from './config/winston.config';
import { envConfigOptions } from './config/env.config';
import { SentryModule } from './sentry/sentry.module';
import { sentryOptions } from './config/sentry.config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { TypeOrmExceptionFilter } from './filter/typeorm-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    SentryModule.forRoot(sentryOptions),
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
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },
  ],
  exports: [ConfigModule, WinstonModule],
})
export class CommonModule {}
