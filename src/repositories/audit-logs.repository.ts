import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from 'src/entities/audit_logs'; // Corrected import path

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  async createAuditLog(user_id: number, manipulate: string, params: any, timestamp: Date = new Date()): Promise<AuditLog> {
    const auditLogEntry = new AuditLog(user_id, timestamp, manipulate, JSON.stringify(params));

    // After applying the patch
    return await this.save(auditLogEntry);
  }
}