import { plainToInstance } from 'class-transformer';
import { LoginAdmin } from './post-login.dto';

describe('LoginAdmin', () => {
  let loginAdmin: LoginAdmin;

  beforeEach(() => {
    loginAdmin = plainToInstance(LoginAdmin, {
      username: 'admin',
      password: '1234',
    });
  });

  it('should be defined', () => {
    expect(loginAdmin).toBeDefined();
  });

  describe('LoginAdmin', () => {
    it('toBeInstanceOf', () => {
      expect(loginAdmin).toBeInstanceOf(LoginAdmin);
    });
  });

  describe('username', () => {
    it('should be a string', () => {
      const isString = Reflect.getMetadata(
        'design:type',
        loginAdmin,
        'username',
      );
      expect(isString).toBe(String);
    });
  });

  describe('password', () => {
    it('should be a string', () => {
      const isString = Reflect.getMetadata(
        'design:type',
        loginAdmin,
        'password',
      );
      expect(isString).toBe(String);
    });
  });
});
