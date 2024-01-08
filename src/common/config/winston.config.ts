import * as winston from 'winston';
import { utilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike('DumpInAdmin', {
      prettyPrint: true,
      colors: true,
    }),
  ),
});

const createFileTransport = (level: string): DailyRotateFile => {
  return new DailyRotateFile({
    level,
    filename: `%DATE%.${level}.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    dirname: 'logs' + `/${level}`,
    maxSize: '20m',
    maxFiles: '30d',
  });
};

export const infoLogFileTransport: DailyRotateFile =
  createFileTransport('info');
export const errorLogFileTransport: DailyRotateFile =
  createFileTransport('error');
