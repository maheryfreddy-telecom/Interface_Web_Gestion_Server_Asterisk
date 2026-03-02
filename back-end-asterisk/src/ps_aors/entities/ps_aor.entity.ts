import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ps_aors')
export class PsAors {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact: string;

  @Column({ type: 'int', nullable: true })
  default_expiration: number;

  @Column({ type: 'varchar', length: 80, nullable: true })
  mailboxes: string;

  @Column({ type: 'int', nullable: true })
  max_contacts: number;

  @Column({ type: 'int', nullable: true })
  minimum_expiration: number;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  remove_existing: string;

  @Column({ type: 'int', nullable: true })
  qualify_frequency: number;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  authenticate_qualify: string;
}