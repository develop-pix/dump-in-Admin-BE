import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAdmin } from './dto/post-login.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { GetAdminSession } from './dto/get-admin-session.dto';
import { User } from '../user/entity/user.entity';
import { HttpStatus } from '@nestjs/common';

class MockAuthService {
  login = jest.fn();
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

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
        }
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login()', () => {
    const mockRequest: LoginAdmin = {
      username: 'admin',
      password: 'admin',
    };
    const mockSession = { user: {} };

    it('SUCCESS: 로그인시 세션을 생성하고 HTTP 200 OK 반환', async () => {
      //given
      const expectedAdmin = await authService.login(mockRequest);
      const expectedSession = new GetAdminSession(expectedAdmin);

      //when
      const result = await controller.login(mockRequest, mockSession);

      //then
      expect(result).toBeInstanceOf(ResponseEntity);
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result.message).toEqual('admin님이 로그인 했습니다.');
      expect(mockRequest).toEqual(mockSession.user);
      expect(mockRequest.username).toEqual(expectedSession.username);
    });
  });
});
