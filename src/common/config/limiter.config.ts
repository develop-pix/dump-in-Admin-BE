import { rateLimit } from 'express-rate-limit';
import { GetAdminSessionDto } from '../../user/dto/get-session-admin.dto';
import { Request } from 'express';
import { createLog } from './log-helper.config';
import { HttpStatus, Logger } from '@nestjs/common';
import { ResponseEntity } from '../entity/response.entity';
import * as Sentry from '@sentry/node';

declare module 'express-session' {
  interface SessionData {
    user?: GetAdminSessionDto;
  }
}

const logger: Logger = new Logger();
const max = +process.env.RATE_LIMITER;
const minute = 60 * 1000;
function createRateLimiter(windowMs: number) {
  return rateLimit({
    windowMs,
    max,
    message: (req: Request) => {
      const response = ResponseEntity.EXCEPTION(
        '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
        HttpStatus.TOO_MANY_REQUESTS,
      );

      logger.log(createLog({ req, response }));
      Sentry.captureEvent({ message: response.message, level: 'info' });

      return response;
    },
    skip: (req: Request) => req.session?.user !== undefined,
  });
}

export const limiter = createRateLimiter(minute);
export const loginLimiter = createRateLimiter(30 * minute);
