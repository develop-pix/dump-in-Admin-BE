import { Logger, Module } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../filter/http-exception.filter';

export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

@Module({})
export class SentryModule {
  static forRoot(options: Sentry.NodeOptions) {
    // initialization of Sentry, this is where Sentry will create a Hub
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        Logger,
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
    };
  }
}
