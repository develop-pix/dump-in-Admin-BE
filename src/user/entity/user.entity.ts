import { Review } from '../../review/entity/review.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity('users')
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

  @Column()
  is_active: boolean;

  @Column()
  is_deleted: boolean;

  @Column()
  deleted_at: Date;

  @Column()
  is_agree_privacy: boolean;

  @Column()
  is_agree_marketing: boolean;

  @Column()
  last_login_at: Date;

  @Column()
  gender: string;

  @Column()
  birth: Date;

  @Column()
  is_admin: boolean;

  @OneToMany(() => Review, (review: Review) => review.user)
  reviews: Review[];

  static adminOf({ username }: AdminSignInProps): User {
    const users = new User();

    users.username = username;
    users.is_admin = true;

    return users;
  }

  static byNickname(nickname: string): User {
    const users = new User();

    users.nickname = nickname;

    return users;
  }
}

export interface AdminSignInProps {
  username: string;
  password: string;
}
