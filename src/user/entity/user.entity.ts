import { BaseDateEntity } from '../../common/entity/common-date.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User extends BaseDateEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId: number;

  @Column({ type: 'varchar', nullable: false, length: 128 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 128 })
  username: string;

  @Column({ type: 'varchar', nullable: false, length: 128 })
  nickname: string;

  @Column({ type: 'varchar', nullable: true, length: 128 })
  password: string;

  @Column({ type: 'boolean', nullable: false })
  is_active: boolean;

  @Column({ type: 'boolean', nullable: false })
  is_deleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @Column({ type: 'boolean', nullable: false })
  is_agree_privacy: boolean;

  @Column({ type: 'boolean', nullable: false })
  is_agree_marketing: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ type: 'varchar', nullable: true, length: 8 })
  gender: string;

  @Column({ type: 'timestamp', nullable: true })
  birth: Date;

  @Column({ type: 'boolean', nullable: false })
  is_admin: boolean;

  static of({ username, password }: UserSignInProps): User {
    const users = new User();

    users.username = username;
    users.password = password;

    return users;
  }
}

export interface UserSignInProps {
  username: string;
  password: string;
}
