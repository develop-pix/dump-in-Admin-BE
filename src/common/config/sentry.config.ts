import { NodeOptions } from '@sentry/node';
import '@sentry/tracing';

export const sentryOptions: NodeOptions = {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV !== 'production',
};
