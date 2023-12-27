import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createLog } from '../config/log-helper.config';
import { ResponseEntity } from '../entity/response.entity';
import * as Sentry from '@sentry/node';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost): Error {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = (exception as HttpException).getStatus();
    const getResponse = (exception as HttpException).getResponse();
    const response = ResponseEntity.EXCEPTION(
      getResponse['message'] || 'Internal Server Error',
      statusCode,
    );
    const stack = exception.stack;
    const log = createLog({ req, stack, response });

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
      Sentry.captureException(exception);
    }

    this.logger.log(log);
    res.status(statusCode).json(response);
    return exception;
  }
}
