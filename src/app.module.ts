import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ExceptionModule } from './common/filter/exception-filter.module';
import { PhotoBoothModule } from './photo-booth/photo-booth.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
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
      synchronize: process.env.NODE_ENV === 'local',
      logging: process.env.NODE_ENV !== 'production',
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        '!**/common/**/*.entity{.ts,.js}',
      ],
      ssl:
        process.env.NODE_ENV === 'local'
          ? undefined
          : { rejectUnauthorized: false },
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            utilities.format.nestLike('DumpInAdmin', {
              prettyPrint: true,
              colors: true,
            }),
          ),
        }),
      ],
    }),
    PhotoBoothModule,
    ExceptionModule,
    EventModule,
    UserModule,
    AuthModule,
    HashtagModule,
    ReviewModule,
  ],
})
export class AppModule {}
