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
import { SentryModule } from './sentry/sentry.module';
import { sentryOptions } from './config/sentry.config';

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
  exports: [ConfigModule, WinstonModule],
})
export class CommonModule {}
