import { rateLimit } from 'express-rate-limit';
import { GetAdminSessionDto } from '../../user/dto/get-session-admin.dto';
import { Request } from 'express';
import { createLog, formattedResponse } from './log-helper.config';
import { HttpStatus, Logger } from '@nestjs/common';

declare module 'express-session' {
  interface SessionData {
    user?: GetAdminSessionDto;
  }
}

const logger: Logger = new Logger();
const maxRequests = process.env.NODE_ENV === 'production' ? 3 : 15;
const minute = 60 * 1000;
function createRateLimiter(windowMs: number) {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: (req: Request) => {
      const response = formattedResponse(
        HttpStatus.TOO_MANY_REQUESTS,
        '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
      );
      logger.error(createLog({ req, response }));
      return response;
    },
    skip: (req: Request) => req.session?.user !== undefined,
  });
}

export const limiter = createRateLimiter(minute);
export const loginLimiter = createRateLimiter(30 * minute);
