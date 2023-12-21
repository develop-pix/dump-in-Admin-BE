import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Session } from './auth/entity/session.entity';
import { DataSource } from 'typeorm';
import * as session from 'express-session';
import { LoggedCheckGuard } from './auth/guard/logged-check.guard';
import { getSessionOptions } from './common/config/session.config';
import { corsOptions } from './common/config/cors.config';
import { pipeOptions } from './common/config/pipe.config';
import { limiter, loginLimiter } from './common/config/limiter.config';
import { swaggerConfig } from './common/config/swagger.config';
import { sentryOptions } from './common/config/sentry.config';
import * as Sentry from '@sentry/node';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const sessionRepo = app.get(DataSource).getRepository(Session);
  Sentry.init(sentryOptions);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/swagger', app, document);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(session(getSessionOptions(sessionRepo)));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe(pipeOptions));
  app.useGlobalFilters(new HttpExceptionFilter(new Logger()));
  app.enableCors(corsOptions);
  app.useGlobalGuards(new LoggedCheckGuard());
  app.setGlobalPrefix('api');
  app.use(limiter);
  app.use('/api/auth/login', loginLimiter);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
