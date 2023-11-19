import { ISession } from "connect-typeorm";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity('session')
export class Session implements ISession {
  @Index()
  @Column({ type: "bigint", name: "expired_at" })
  expiredAt = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  id = "";

  @Column("text")
  json = "";

  @DeleteDateColumn()
  destroyedAt?: Date;
}