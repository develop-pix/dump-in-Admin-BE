import { Review } from '../../review/entity/review.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Entity('user')
@Unique(['email'])
export class User extends BaseDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'is_deleted' })
  isDeleted: boolean;

  @Column({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ name: 'is_agree_privacy' })
  isAgreePrivacy: boolean;

  @Column({ name: 'is_agree_marketing' })
  isAgreeMarketing: boolean;

  @Column({ name: 'last_login' })
  lastLogin: Date;

  @Column()
  gender: string;

  @Column()
  birth: Date;

  @Column({ name: 'is_admin' })
  isAdmin: boolean;

  @OneToMany(() => Review, (review: Review) => review.user)
  reviews: Review[];

  static adminOf(username: string): User {
    const users = new User();

    users.username = username;
    users.isAdmin = true;

    return users;
  }

  static byNickname(nickname: string): User {
    const users = new User();

    users.nickname = nickname;

    return users;
  }

  static comparePassword(
    requestPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    const parsingDBPassword = dbPassword.replace('bcrypt_sha256$', '');
    const hashed = crypto
      .createHash('sha256')
      .update(requestPassword)
      .digest('hex');
    return bcrypt.compare(hashed, parsingDBPassword);
  }
}
