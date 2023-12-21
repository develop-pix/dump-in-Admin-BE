import { Request } from 'express';
import { ResponseEntity } from '../entity/response.entity';

interface createLogProps {
  req: Request;
  stack?: string | undefined;
  response?: ResponseEntity<string>;
}

export const createLog = ({ req, response, stack }: createLogProps) => ({
  ip: req.ip,
  date: new Date().toLocaleString('ko-KR', { timeZone: process.env.TZ }),
  url: req.url,
  response: response,
  stack: process.env.NODE_ENV === 'production' ? undefined : stack,
});
