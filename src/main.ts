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
import * as session from 'express-session';
import * as passport from 'passport';
// import * as connectPgSimple from 'connect-pg-simple';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // const pgSession = connectPgSimple(session);
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
    // store: new pgSession({
    //   conObject: {
    //     connectionString: process.env.DATABASE_URL,
    //   },
    //   tableName: 'session',
    // }),
    secret: process.env.SET_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
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
  app.use(passport.initialize());
  app.use(passport.session());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app
    .useGlobalPipes(new ValidationPipe(validationPipeOptions))
    .useGlobalFilters(new HttpExceptionFilter(new Logger()))
    .enableCors(corsOptions);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  SwaggerModule.setup('api-docs', app, document);
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('Session Options:', sessionOptions);
  await app.listen(3000);
}
bootstrap();
