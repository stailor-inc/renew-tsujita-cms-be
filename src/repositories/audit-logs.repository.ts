import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from 'src/entities/audit_logs';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  async createAuditLog(user_id: number, timestamp: Date, manipulate: string, params: string): Promise<AuditLog> {
    const auditLogEntry = new AuditLog();
    auditLogEntry.user_id = user_id;
    auditLogEntry.timestamp = timestamp;
    auditLogEntry.manipulate = manipulate;
    auditLogEntry.params = params;

    // After applying the patch
    return await this.createOne({ data: auditLogEntry });
  }
}