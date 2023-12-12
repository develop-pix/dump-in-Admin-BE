import { Review } from '../../review/entity/review.entity';
import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

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

  static adminOf({ username }: AdminSignInProps): User {
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
}

export interface AdminSignInProps {
  username: string;
  password: string;
}
