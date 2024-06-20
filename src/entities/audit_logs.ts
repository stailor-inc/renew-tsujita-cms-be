import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@entities/users';

@Entity('audit_logs')
export class AuditLog {
  @Column({ type: 'integer', primary: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  timestamp: Date;

  @Column({ nullable: true, type: 'varchar' })
  manipulate: string;

  @Column({ nullable: true, type: 'text' })
  params: string;

  @Column({ nullable: true, type: 'integer' })
  user_id: number;

  @Column({ nullable: true, type: 'varchar' })
  screen: string;

  @ManyToOne(() => User, (user) => user.audit_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
