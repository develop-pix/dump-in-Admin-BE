import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const stack = exception.stack;
    const logIp = req.ip;

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const statusCode = (exception as HttpException).getStatus();
    const response = (exception as HttpException).getResponse();
    const formattedResponse = {
      code: statusCode,
      message: response['message'] || 'Internal Server Error',
      success: false,
      data: '',
    };

    const log = {
      ip: logIp,
      url: req.url,
      response: formattedResponse,
      stack,
    };
    this.logger.error(log);

    res
      .status((exception as HttpException).getStatus())
      .json(formattedResponse);
  }
}
