import { Request } from 'express';

interface createLogProps {
  req: Request;
  stack?: string | undefined;
  response?: Record<string, unknown>;
}

export const formattedResponse = (code: number, message: string) => ({
  code: code,
  message: message,
  success: false,
  data: '',
});

export const createLog = ({ req, response, stack }: createLogProps) => ({
  ip: req.ip,
  date: new Date().toISOString(),
  url: req.url,
  response: response,
  stack: process.env.NODE_ENV === 'production' ? undefined : stack,
});
