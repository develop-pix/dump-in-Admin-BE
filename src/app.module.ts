import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExceptionModule } from './common/filter/exception-filter.module';
import { PhotoBoothModule } from './photo-booth/photo-booth.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { ReviewModule } from './review/review.module';
import { EventModule } from './event/event.module';
import {
  consoleTransport,
  errorLogFileTransport,
  infoLogFileTransport,
} from './common/config/winston.config';
import { envConfigOptions } from './common/config/env.config';
import { WinstonModule } from 'nest-winston';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfigOptions),
    WinstonModule.forRoot({
      transports: [
        consoleTransport,
        infoLogFileTransport,
        errorLogFileTransport,
      ],
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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl:
        process.env.NODE_ENV === 'local'
          ? undefined
          : { rejectUnauthorized: false },
    }),
    PhotoBoothModule,
    ExceptionModule,
    EventModule,
    UserModule,
    AuthModule,
    HashtagModule,
    ReviewModule,
    DashboardModule,
  ],
})
export class AppModule {}
