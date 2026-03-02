import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ps_endpoints')
export class PsEndpoint {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  id: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  transport: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  aors: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  auth: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  context: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  disallow: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  allow: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  direct_media: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  force_rport: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  ice_support: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  rewrite_contact: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  rtp_symmetric: string;

  // --- Autres champs présents dans ton DESCRIBE (Optionnels mais recommandés) ---

  @Column({ type: 'varchar', length: 40, nullable: true })
  dtmf_mode: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  mailboxes: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  callerid: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  language: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  trust_id_inbound: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  trust_id_outbound: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  send_rpid: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], nullable: true })
  send_pai: string;

  @Column({ type: 'int', nullable: true })
  timers_min_se: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  outbound_proxy: string;
}