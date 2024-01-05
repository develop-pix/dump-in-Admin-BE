import { User } from '../../user/entity/user.entity';
import { GetAdminSession } from './get-admin-session.dto';

describe('GetAdminSession', () => {
  let user: User;
  let getAdminSession: GetAdminSession;

  beforeEach(() => {
    user = new User();
    user.email = 'feed-me-admin1@naver.com';
    user.username = 'feed-me-admin1';
    user.isAdmin = true;

    getAdminSession = new GetAdminSession(user);
  });

  it('should create an instance', () => {
    expect(getAdminSession).toBeDefined();
  });

  it('should have correct email', () => {
    expect(getAdminSession.email).toEqual(user.email);
  });

  it('should have correct username', () => {
    expect(getAdminSession.username).toEqual(user.username);
  });

  it('should have correct isAdmin value', () => {
    expect(getAdminSession.isAdmin).toEqual(user.isAdmin);
  });
});
