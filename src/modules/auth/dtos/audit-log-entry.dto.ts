import { IsInt, IsDateString, IsEnum, IsString } from 'class-validator';

export enum ManipulateAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
}

export class AuditLogEntryDto {
  @IsInt({ message: 'User not found.' })
  user_id: number;

  @IsDateString({}, { message: 'Invalid timestamp.' })
  timestamp: Date;

  @IsEnum(ManipulateAction, { message: 'Action for the log entry is required.' })
  manipulate: ManipulateAction;

  @IsString({ message: 'Invalid parameters.' })
  params: string;
}