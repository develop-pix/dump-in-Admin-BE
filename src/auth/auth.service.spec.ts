import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repository/user.repository';

class MockUserRepository {
  findByUsername = jest.fn();
}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
