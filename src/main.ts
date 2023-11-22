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
import * as fs from 'fs';
import * as session from 'express-session';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    httpsOptions:
      process.env.NODE_ENV === 'production'
        ? {
            key: fs.readFileSync(process.env.SET_HTTPS_KEY_PATH),
            cert: fs.readFileSync(process.env.SET_HTTPS_CERT_PATH),
          }
        : undefined,
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
      Secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    name: 'session-cookie',
  };

  const config = new DocumentBuilder()
    .setTitle('Dump-In-Admin API')
    .setDescription('The Example API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(session(sessionOptions));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app
    .useGlobalPipes(new ValidationPipe(validationPipeOptions))
    .useGlobalFilters(new HttpExceptionFilter(new Logger()))
    .enableCors(corsOptions);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  SwaggerModule.setup('api-docs', app, document);
  await app.listen(+process.env.APP_SERVER_PORT);
}
bootstrap();
