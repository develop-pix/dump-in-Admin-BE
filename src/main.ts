import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TypeormStore } from 'connect-typeorm';
import { Session } from './auth/entity/session.entity';
import { DataSource } from 'typeorm';
import { rateLimit } from 'express-rate-limit';
import * as session from 'express-session';
import { LoggedCheckGuard } from './auth/guard/logged-check.guard';

async function bootstrap(): Promise<void> {
  const maxRequests = process.env.NODE_ENV === 'production' ? 30 : 90;
  const maxLoginRequests = process.env.NODE_ENV === 'production' ? 5 : 15;
  const minute = 60 * 1000;
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const sessionRepo = app.get(DataSource).getRepository(Session);
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  const validationPipeOptions = {
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  };

  const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  };

  const sessionOptions = {
    store: new TypeormStore({ cleanupLimit: 3, ttl: 86400 }).connect(
      sessionRepo,
    ),
    secret: process.env.SET_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * minute,
    },
    name: 'session-cookie',
  };

  const limiter = rateLimit({
    windowMs: 15 * minute,
    max: maxRequests,
    message: '요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.',
  });

  const loginLimiter = rateLimit({
    windowMs: 30 * minute,
    max: maxLoginRequests,
    message: '로그인 요청 횟수가 너무 많습니다. 잠시 후에 시도하세요.',
  });

  const config = new DocumentBuilder()
    .setTitle('Dump-In-Admin API')
    .setDescription('The Dump-In-Admin API document')
    .setVersion('1.0')
    .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.use(session(sessionOptions));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
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
