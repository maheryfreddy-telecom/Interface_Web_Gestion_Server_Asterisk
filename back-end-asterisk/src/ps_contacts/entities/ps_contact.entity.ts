import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ps_contacts')
export class PsContact {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  uri: string;

  @Column({ type: 'bigint', nullable: true })
  expiration_time: string; // BigInt est souvent traité comme string en JS/NestJS pour éviter les overflows

  @Column({ type: 'int', nullable: true })
  qualify_frequency: number;

  @Column({ type: 'varchar', length: 40, nullable: true })
  endpoint: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_agent: string;
  
  // Ajoute d'autres champs du DESCRIBE si tu en as besoin
}