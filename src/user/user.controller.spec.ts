import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { PaginationDto } from '../common/dto/get-pagination-query.dto';
import { PageEntity } from '../common/dto/get-pagination-list.dto';
import { GetUserList } from './dto/get-user.dto';
import { ResponseEntity } from '../common/entity/response.entity';
import { HttpStatus } from '@nestjs/common';

class MockUserService {
  findAllUser = jest.fn();
}

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useClass: MockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAllUser', () => {
    it('SUCCESS: 유저 목록 반환', async () => {
      const mockRequest = new PaginationDto();
      const mockResponse = [new User()];
      const mockCount = 2;

      jest
        .spyOn(userService, 'findAllUser')
        .mockResolvedValue([mockResponse, mockCount]);

      const result = await userController.findAllUser(mockRequest);

      expect(userService.findAllUser).toHaveBeenCalledWith(
        mockRequest.getPageProps(),
      );
      expect(result.code).toEqual(HttpStatus.OK);
      expect(result).toEqual(
        ResponseEntity.OK_WITH<PageEntity<GetUserList>>(
          expect.any(String),
          expect.any(PageEntity<GetUserList>),
        ),
      );
    });
  });
});
