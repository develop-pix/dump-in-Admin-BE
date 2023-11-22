import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { RawAdmin } from '../user/dto/get-session-admin.dto';
import { User } from '../user/entity/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

class MockUserRepository {
  findByUsername = jest.fn();
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);

    //Bcrypt Stub
    jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation((plain, hashed) =>
        Promise.resolve(`${plain} hashed 12` === hashed),
      );

    // UserRepository Stub
    jest
      .spyOn(userRepository, 'findByUsername')
      .mockImplementation((username: string) => {
        if (username === 'admin') {
          const savedUser = new User();
          savedUser.username = 'admin';
          savedUser.email = 'admin@example.com';
          savedUser.password = 'admin hashed 12';
          savedUser.is_admin = true;
          return Promise.resolve(new RawAdmin(savedUser));
        } else if (username === 'user') {
          const savedUser = new User();
          savedUser.username = 'user';
          savedUser.email = 'user@example.com';
          savedUser.password = 'user hashed 12';
          savedUser.is_admin = false;
          return Promise.resolve(new RawAdmin(savedUser));
        } else {
          return Promise.resolve(null);
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('logInAndSetSession()', () => {
    const mockSession = {};

    it('SUCCESS: 어드민 역할을 가진 유저일 때 로그인', async () => {
      const adminUser = new User();
      adminUser.username = 'admin';
      adminUser.password = 'admin';

      const result = await authService.logInAndSetSession(
        adminUser,
        mockSession,
      );

      expect(result.email).toEqual('admin@example.com');
      expect(result.isAdmin).toEqual(true);
      expect(result.username).toEqual('admin');
    });

    it('FAILURE: 어드민 역할이 아닐 때, 401 예외 throw', async () => {
      const notAdminUser = new User();
      notAdminUser.username = 'user';
      notAdminUser.password = 'user';

      await expect(async () => {
        await authService.logInAndSetSession(notAdminUser, mockSession);
      }).rejects.toThrowError(
        new UnauthorizedException('관리자 권한이 없습니다'),
      );
    });

    it('FAILURE: 유저 정보가 존재하지 않을 때, 401 예외 throw', async () => {
      const notExistUser = new User();
      notExistUser.username = 'anonymous';
      notExistUser.password = 'anonymous';

      await expect(async () => {
        await authService.logInAndSetSession(notExistUser, mockSession);
      }).rejects.toThrowError(
        new UnauthorizedException('사용자 정보를 찾을 수 없습니다.'),
      );
    });

    it('FAILURE: 아이디와 비밀번호가 다를 때, 409 예외 throw', async () => {
      const wrongAdminUser = new User();
      wrongAdminUser.username = 'admin';
      wrongAdminUser.password = 'wrong';

      await expect(async () => {
        await authService.logInAndSetSession(wrongAdminUser, mockSession);
      }).rejects.toThrowError(
        new ConflictException('관리자 정보가 일치하지 않습니다'),
      );
    });
  });
});
