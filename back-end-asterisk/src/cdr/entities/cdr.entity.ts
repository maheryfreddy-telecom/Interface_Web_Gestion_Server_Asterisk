import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cdr')
export class Cdr {
  // 'uniqueid' semble être une bonne clé primaire, sinon Asterisk n'a pas toujours de PK propre sur CDR
  @PrimaryColumn({ type: 'varchar', length: 150 })
  uniqueid: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  src: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  dst: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  dcontext: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  clid: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  channel: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  dstchannel: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  lastapp: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  lastdata: string;

  @Column({ type: 'datetime', nullable: true })
  start: Date; // CORRECTION: C'est 'start' dans ta DB, pas 'calldate'

  @Column({ type: 'datetime', nullable: true })
  answer: Date;

  @Column({ type: 'datetime', nullable: true })
  end: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  billsec: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  disposition: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  accountcode: string;
}