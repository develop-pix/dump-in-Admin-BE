import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class UpdatedDateEntity {
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: Date;
}

@Entity()
export class BaseDateEntity extends UpdatedDateEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;
}