import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS.split(',')
      : true,
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true,
  optionsSuccessStatus: 200,
};
