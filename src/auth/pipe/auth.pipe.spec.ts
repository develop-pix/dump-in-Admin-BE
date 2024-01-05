import { Test, TestingModule } from '@nestjs/testing';
import { AuthPipe } from './auth.pipe';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { GetAdminSession } from '../dto/get-admin-session.dto';
import { User } from '../../user/entity/user.entity';
import { LoginAdmin } from '../dto/post-login.dto';

class MockAuthService {
  login = jest.fn();
  verifyCredentials = jest.fn();
}

describe('AuthPipe', () => {
  let authPipe: AuthPipe;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPipe,
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compile();

    authPipe = module.get<AuthPipe>(AuthPipe);
    authService = module.get<AuthService>(AuthService);

    jest
      .spyOn(User, 'comparePassword')
      .mockImplementation((request: string, saved: string) => {
        if (request !== saved) {
          return Promise.reject(false);
        }
        return Promise.resolve(true);
      });

    jest
      .spyOn(authService, 'login')
      .mockImplementation((request: LoginAdmin) => {
        if (request.username === 'admin') {
          const savedUser = new User();
          savedUser.username = 'admin';
          savedUser.email = 'admin@example.com';
          savedUser.password = 'admin';
          savedUser.isAdmin = true;
          return Promise.resolve(savedUser);
        } else {
          return Promise.reject(
            new UnauthorizedException('관리자 정보가 존재하지 않습니다.'),
          );
        }
      });

    jest
      .spyOn(authService, 'verifyCredentials')
      .mockImplementation((request: LoginAdmin, admin: User) => {
        if (request.password !== admin.password) {
          return Promise.reject(
            new UnauthorizedException('비밀번호가 일치하지 않습니다.'),
          );
        }
        return User.comparePassword(request.password, admin.password);
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authPipe).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('transform()', () => {
    const loginAdmin: LoginAdmin = { username: 'admin', password: 'admin' };

    it('SUCCESS: 관리자 정보가 존재하고 비밀번호가 일치할 때, GetAdminSession 객체 반환', async () => {
      //given
      const adminInDb = await authService.login(loginAdmin);
      const isSamePassword = await authService.verifyCredentials(
        loginAdmin,
        adminInDb,
      );

      const expectedResult = new GetAdminSession(adminInDb);

      //when
      const result = await authPipe.transform(loginAdmin);

      //then
      expect(result).toBeInstanceOf(GetAdminSession);
      expect(authService.login).toHaveBeenCalledWith(loginAdmin);
      expect(authService.verifyCredentials).toHaveBeenCalledWith(
        loginAdmin,
        adminInDb,
      );
      expect(result).toEqual(expectedResult);
      expect(isSamePassword).toEqual(true);
    });

    it('FAILURE: 관리자 정보가 존재하지 않을 때, UnauthorizedException throw', async () => {
      //given
      loginAdmin.username = 'anonymous';

      //when & then
      await expect(async () => {
        await authPipe.transform(loginAdmin);
      }).rejects.toThrowError(
        new UnauthorizedException('관리자 정보가 존재하지 않습니다.'),
      );
    });

    it('FAILURE: 비밀번호가 일치하지 않을 때, UnauthorizedException throw', async () => {
      //given
      loginAdmin.username = 'admin';
      loginAdmin.password = 'wrong password';

      //when & then
      await expect(async () => {
        await authPipe.transform(loginAdmin);
      }).rejects.toThrowError(
        new UnauthorizedException('비밀번호가 일치하지 않습니다.'),
      );
    });
  });
});
