import { rateLimit } from 'express-rate-limit';
import { GetAdminSessionDto } from '../../user/dto/get-session-admin.dto';

declare module 'express-session' {
  interface SessionData {
    user?: GetAdminSessionDto;
  }
}

const maxRequests = process.env.NODE_ENV === 'production' ? 3 : 15;
const minute = 60 * 1000;

export const limiter = rateLimit({
  windowMs: minute,
  max: maxRequests,
  message: '요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.',
});

export const loginLimiter = rateLimit({
  windowMs: 30 * minute,
  max: maxRequests,
  message: '로그인 요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.',
  skip: (req) => req.session?.user !== undefined,
});
