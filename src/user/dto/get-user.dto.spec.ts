import { plainToInstance } from 'class-transformer';
import { GetUserList } from './get-user.dto';
import { User } from '../entity/user.entity';

describe('GetUserList', () => {
  let mockUserData: User;
  let getUserList: GetUserList;

  beforeEach(() => {
    mockUserData = plainToInstance(User, {
      id: 1,
      username: 'feed-me-admin1',
      email: 'example@example.com',
      reviews: [],
    });

    getUserList = new GetUserList(mockUserData);
  });

  it('should be defined', () => {
    expect(getUserList).toBeDefined();
    expect(mockUserData).toBeInstanceOf(User);
  });

  it('SUCCESS: User 엔티티로 GetUserList DTO 생성', () => {
    expect(getUserList.id).toEqual(mockUserData.id);
    expect(getUserList.username).toEqual(mockUserData.username);
    expect(getUserList.email).toEqual(mockUserData.email);
    expect(getUserList.review).toEqual(0);
  });
});
