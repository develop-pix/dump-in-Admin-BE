import { SessionOptions } from 'express-session';
import { ISession, TypeormStore } from 'connect-typeorm';
import { Repository } from 'typeorm';

export const createSessionStore = (
  sessionRepo: Repository<ISession>,
): TypeormStore => {
  return new TypeormStore({
    cleanupLimit: 3,
    ttl: 86400,
  }).connect(sessionRepo);
};

export const getSessionOptions = (
  sessionRepo: Repository<ISession>,
): SessionOptions & { store: TypeormStore } => {
  return {
    store: createSessionStore(sessionRepo),
    secret: process.env.SET_COOKIE_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? undefined : 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: 'session-cookie',
  };
};
