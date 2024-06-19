import { IsInt, IsDate, IsString, Matches, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../entities/users.ts';
import { AuditLog } from '../../entities/audit_logs.ts';

export class AuditLogEntryDto {
  @IsInt({ message: 'User not found.' })
  @ValidateIf((o) => o.user_id !== undefined)
  user_id: number;

  @Type(() => Date)
  @IsDate({ message: 'Invalid timestamp.' })
  timestamp: Date;

  @IsString()
  @Matches(/LOGIN_FAILED_PASSWORD_EXPIRED/, { message: "Action for the log entry is required." })
  manipulate: string;

  @IsString({ message: 'Invalid parameters.' })
  params: string;

  constructor(auditLog: AuditLog, user: User) {
    this.user_id = user.id;
    this.timestamp = auditLog.timestamp;
    this.manipulate = auditLog.manipulate;
    this.params = auditLog.params;
  }
}