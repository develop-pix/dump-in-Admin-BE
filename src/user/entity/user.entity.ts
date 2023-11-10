import { BaseDateEntity } from '../../common/entity/common-date.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

export interface UserSignInProps {
  username: string;
  password: string;
}

@Entity('user')
@Unique(['email'])
export class User extends BaseDateEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
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

  @OneToMany(
    () => AuthGroupPermissions,
    (AuthGroupPermissions) => AuthGroupPermissions.authGroup.name,
  )
  @JoinColumn({ name: 'user_group_id' })
  authGroupPermissions: AuthGroupPermissions;

  @ManyToOne(() => AuthGroup, (authGroup) => authGroup.authGroupPermissions, {
    eager: true,
  })
  @JoinTable({
    name: 'auth_group_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'auth_group_id',
      referencedColumnName: 'authGroupPermissionsIds',
    },
  })
  authGroup: AuthGroup;

  static of({ username, password }: UserSignInProps): User {
    const user = new User();

    user.username = username;
    user.password = password;

    return user;
  }
}

@Entity('auth_group_permissions')
export class AuthGroupPermissions {
  @PrimaryGeneratedColumn({ name: 'user_group_id' })
  userGroupId: number;

  @ManyToOne(() => User, (user) => user.authGroupPermissions)
  user: User;

  @ManyToOne(() => AuthGroup, (authGroup) => authGroup.authGroupPermissions)
  authGroup: AuthGroup;
}

@Entity('auth_group')
export class AuthGroup {
  @PrimaryGeneratedColumn({ name: 'user_group_permissions_id' })
  userGroupPermissionsId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => AuthGroupPermissions,
    (authGroupPermissions) => authGroupPermissions.authGroup,
  )
  authGroupPermissions: AuthGroupPermissions[];
}
