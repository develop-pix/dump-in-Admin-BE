import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { User } from './entity/user.entity';

class MockUserRepository {
  findUserByOptionAndCount = jest.fn();
  findOneUser = jest.fn();
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAllUser', () => {
    it('SUCCESS: 유저 목록 조회', async () => {
      const mockRequest = new PaginationDto();
      const mockResponse = [new User()];
      const mockCount = 0;

      jest
        .spyOn(userRepository, 'findUserByOptionAndCount')
        .mockResolvedValueOnce([mockResponse, mockCount]);

      const result = await userService.findAllUser(mockRequest);

      expect(result).toEqual([mockResponse, mockCount]);
      expect(userRepository.findUserByOptionAndCount).toHaveBeenCalledWith(
        mockRequest,
      );
    });
  });

  describe('findOneAdminBy', () => {
    it('SUCCESS: 관리자 정보 조회', async () => {
      const username = 'admin';
      const mockResponse = new User();
      mockResponse.username = username;
      mockResponse.isAdmin = true;

      jest
        .spyOn(userRepository, 'findOneUser')
        .mockResolvedValueOnce(mockResponse);

      const result = await userService.findOneAdminBy(username);

      expect(result.username).toEqual(mockResponse.username);
      expect(result.isAdmin).toEqual(mockResponse.isAdmin);
      expect(result).toBeInstanceOf(User);
      expect(result).toEqual(mockResponse);
      expect(userRepository.findOneUser).toHaveBeenCalledWith(
        User.adminOf(username),
      );
    });
  });
});
