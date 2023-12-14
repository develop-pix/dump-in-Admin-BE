import * as winston from 'winston';
import { utilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';
export const consoleTransport = new winston.transports.Console({
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

export const infoLogFileTransport: DailyRotateFile = new DailyRotateFile({
  level: 'info',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  dirname: logDir,
  maxSize: '20m',
  maxFiles: '30d',
});

export const errorLogFileTransport: DailyRotateFile = new DailyRotateFile({
  level: 'error',
  filename: '%DATE%.error.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  dirname: logDir + '/error',
  maxSize: '20m',
  maxFiles: '30d',
});
