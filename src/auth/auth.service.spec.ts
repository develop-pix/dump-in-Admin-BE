import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';

class MockUserService {
  findOneAdminBy = jest.fn();
}

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useClass: MockUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    // UserService Stub
    jest.spyOn(userService, 'findOneAdminBy').mockImplementation((username) => {
      if (username === 'admin') {
        const savedUser = new User();
        savedUser.username = 'admin';
        savedUser.email = 'admin@example.com';
        savedUser.password = 'admin hashed 12';
        savedUser.isAdmin = true;
        return Promise.resolve(savedUser);
      } else {
        return Promise.reject(
          new NotFoundException('관리자 정보를 찾지 못했습니다'),
        );
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('validateAdminForLogIn', () => {
    const getLogInProps = { username: 'admin', password: 'admin' };

    it('SUCCESS: 어드민 역할을 가진 유저일 때 로그인', async () => {
      const result = await authService.login(getLogInProps);

      expect(result).toBeInstanceOf(User);
      expect(result.isAdmin).toEqual(true);
    });

    it('FAILURE: 비밀번호가 맞지 않을 때, 거짓 반환 (boolean)', async () => {
      getLogInProps.password = 'wrong password';
      const result = await authService.login(getLogInProps);
      const response = await User.comparePassword(
        getLogInProps.password,
        result.password,
      );

      expect(result).toBeInstanceOf(User);
      expect(response).toEqual(false);
    });

    it('FAILURE: 관리자 정보가 존재하지 않을 때, 404 예외 throw', async () => {
      getLogInProps.username = 'anonymous';

      await expect(async () => {
        await authService.login(getLogInProps);
      }).rejects.toThrowError(
        new NotFoundException('관리자 정보를 찾지 못했습니다'),
      );
    });
  });
});
