import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../user/entity/user.entity';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {
    super();
  }
  /**
   * @param User
   * @desc Passport에서 세션에 저장할 정보나 저장된 정보를 가져옵니다.
   */

  serializeUser(user: User, done: CallableFunction) {
    this.logger.log('info', user);
    done(null, user);
  }

  async deserializeUser(user: User, done: CallableFunction) {
    return await this.userRepository
      .findByUsernameOrFail(user.username)
      .then((user) => {
        this.logger.log('info', user);
        done(null, user);
      })
      .catch((error) => done(error));
  }
}
