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
import { PhotoBooth } from './photo-booth/entity/photo-booth.entity';
import { HiddenPhotoBooth } from './photo-booth/entity/photo-booth-hidden.entity';
import {
  Hashtag,
  PhotoBoothBrand,
  PhotoBoothHashtag,
} from './photo-booth/entity/photo-booth-brand.entity';
import { EventModule } from './event/event.module';
import { EventImage } from './event/entity/event-image.entity';
import { Events } from './event/entity/event.entity';
import { HashtagModule } from './hashtag/hashtag.module';

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
        EventImage,
        Events,
        User,
        Session,
        PhotoBooth,
        HiddenPhotoBooth,
        PhotoBoothBrand,
        PhotoBoothHashtag,
        Hashtag,
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
    AuthModule,
    EventModule,
    HashtagModule,
  ],
})
export class AppModule {}
