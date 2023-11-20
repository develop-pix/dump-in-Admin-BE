import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ExceptionModule } from './common/filter/exception-filter.module';
import { PhotoBoothModule } from './photo-booth/photo-booth.module';
import { User } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { Session } from './auth/entity/session.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      // ssl: {
      //   "rejectUnauthorized": false
      // },
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      entities: [User, Session],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            utilities.format.nestLike('DumpInAdmin', { prettyPrint: true }),
          ),
        }),
      ],
    }),
    PhotoBoothModule,
    ExceptionModule,
    AuthModule,
  ],
})
export class AppModule {}
