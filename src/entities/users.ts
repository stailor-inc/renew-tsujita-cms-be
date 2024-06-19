import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm'; // Ensure this import is from the correct package
import { AuditLog } from '@entities/audit_logs'; // Verify this import path is correct

enum StatusEnum {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  INVALID = 'INVALID',
}

@Entity('users')
export class User {
  @Column({ type: 'integer', primary: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  password_hash: string;

  @Column({ nullable: true, type: 'varchar' })
  password_salt: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: StatusEnum, // Use the StatusEnum for the enum type
    default: StatusEnum.ACTIVE, // Use the StatusEnum for the default value
  })
  status: StatusEnum; // Use the StatusEnum for the status type

  @Column({ nullable: true, type: 'timestamp' })
  password_last_changed: Date;

  @Column({ nullable: true, type: 'varchar' })
  remember_me_token: string;

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  audit_logs: AuditLog[];
}

export { StatusEnum }; // Ensure the StatusEnum is exported correctly