import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createLog, formattedResponse } from '../config/log-helper.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const statusCode = (exception as HttpException).getStatus();
    const getResponse = (exception as HttpException).getResponse();
    const response = formattedResponse(
      statusCode,
      getResponse['message'] || 'Internal Server Error',
    );

    this.logger.error(createLog({ req, stack, response: response }));

    res.status(statusCode).json(response);
  }
}
