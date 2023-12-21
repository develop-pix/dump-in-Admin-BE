import { NodeOptions } from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export const sentryOptions: NodeOptions = {
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [new ProfilingIntegration()],
  enabled: process.env.NODE_ENV === 'production',
};
