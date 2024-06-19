import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from '@entities/audit_logs';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {}
