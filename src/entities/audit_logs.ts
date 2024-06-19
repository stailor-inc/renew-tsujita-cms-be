import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar' })
  manipulate: string;

  @Column({ type: 'text' })
  params: string;

  @ManyToOne(() => User, (user) => user.audit_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(user_id: number, timestamp: Date, manipulate: string, params: string) {
    this.user_id = user_id;
    this.timestamp = timestamp;
    this.manipulate = manipulate;
    this.params = params;
  }
}