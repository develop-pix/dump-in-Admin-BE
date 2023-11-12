import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['email'])
export class User extends BaseDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId: number;

  @Column({ name: 'email', type: 'varchar', nullable: false, length: 128 })
  email: string;

  @Column({ name: 'username', type: 'varchar', nullable: false, length: 128 })
  username: string;

  @Column({ name: 'nickname', type: 'varchar', nullable: false, length: 128 })
  nickname: string;

  @Column({ name: 'password', type: 'varchar', nullable: true, length: 128 })
  password: string;

  @Column({ name: 'is_active', type: 'bool', nullable: false })
  isActive: boolean;

  @Column({ name: 'is_deleted', type: 'bool', nullable: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'is_agree_privacy', type: 'bool', nullable: false })
  isAgreePrivacy: boolean;

  @Column({ name: 'is_agree_marketing', type: 'bool', nullable: false })
  isAgreeMarketing: boolean;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'gender', type: 'varchar', nullable: true, length: 8 })
  gender: string;

  @Column({ name: 'birth', type: 'timestamp', nullable: true })
  birth: Date;

  @Column({ name: 'group', type: 'varchar', nullable: false, length: 16 })
  group: string;

  static of({ username, password }: UserSignInProps): User {
    const user = new User();

    user.username = username;
    user.password = password;

    return user;
  }
}

export interface UserSignInProps {
  username: string;
  password: string;
}
