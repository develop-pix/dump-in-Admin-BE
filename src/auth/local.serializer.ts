import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Logger, Repository } from "typeorm";
import { AuthService } from "./auth.service";
import { User } from "../user/entity/user.entity";

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private logger: Logger
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    this.logger.log('info', user);
    done(null, user.username)
  }

  async deserializeUser(username: string, done: CallableFunction) {
    return await this.userRepository.findOneOrFail({ where: { username } })
      .then((user) => {
        this.logger.log('info', user);
        done(null, user);
      })
      .catch((error) => done(error))
  }
}