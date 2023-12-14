import * as winston from 'winston';
import { utilities } from 'nest-winston';

export const winstonConsoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    utilities.format.nestLike('DumpInAdmin', {
      prettyPrint: true,
      colors: true,
    }),
  ),
});
