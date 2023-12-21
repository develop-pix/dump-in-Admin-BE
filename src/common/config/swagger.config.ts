import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Dump-in Admin API')
  .setDescription('The Dump-in Admin API Document')
  .setVersion('1.3')
  .addServer('/api')
  .build();
