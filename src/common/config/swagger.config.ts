import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Dump-In-Admin API')
  .setDescription('The Dump-In-Admin API document')
  .setVersion('1.0')
  .addServer('/api')
  .build();
