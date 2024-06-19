import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from 'src/entities/audit_logs'; // Corrected import path

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  async createAuditLog(user_id: number, manipulate: string, params: any): Promise<AuditLog> {
    const auditLogEntry = new AuditLog();
    auditLogEntry.timestamp = new Date(); // Set the current date as the timestamp
    auditLogEntry.manipulate = manipulate;
    auditLogEntry.params = JSON.stringify(params);

    // After applying the patch
    return await this.save(auditLogEntry);
  }
}