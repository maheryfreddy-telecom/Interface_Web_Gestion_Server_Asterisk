import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column()
  password: string; // Hash bcrypt

  @Column({ default: 'user' })
  role: string; // 'admin' ou 'user'

  @CreateDateColumn()
  createdAt: Date;
}
