export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Accept, Authorization',
};
