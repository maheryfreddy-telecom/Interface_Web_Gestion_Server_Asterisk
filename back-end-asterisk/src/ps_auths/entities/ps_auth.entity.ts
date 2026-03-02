import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ps_auths')
export class PsAuths {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'enum', enum: ['md5', 'userpass'], nullable: true })
  auth_type: string;

  @Column({ type: 'int', nullable: true })
  nonce_lifetime: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  md5_cred: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  realm: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  username: string;
}