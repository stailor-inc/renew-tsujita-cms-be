import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from 'src/entities/audit_logs'; // Corrected import path

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  async createAuditLog(user_id: number, manipulate: string, params: any): Promise<AuditLog> {
    const auditLogEntry = new AuditLog(user_id, new Date(), manipulate, JSON.stringify(params)); // Integrated patch

    return await this.createOne({ data: auditLogEntry });
  }
}