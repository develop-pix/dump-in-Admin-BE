import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseDateEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
