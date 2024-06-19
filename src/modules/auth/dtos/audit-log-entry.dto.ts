import { IsInt, IsDate, IsString, ValidateIf, Equals } from 'class-validator';
import { User } from '../../entities/users.ts';
import { AuditLog } from '../../entities/audit_logs.ts';

export class AuditLogEntryDto {
  @IsInt({ message: 'User not found.' })
  @ValidateIf((o) => o.user_id !== undefined)
  user_id: number;

  @IsDate({ message: 'Invalid timestamp.' })
  timestamp: Date;

  @IsString()
  @Equals('LOGIN_SUCCESS', { message: 'Action for the log entry is required.' })
  manipulate: string;

  @IsString({ message: 'Invalid parameters.' })
  params: string;
}