import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/shared/base.repository';
import { AuditLog } from 'src/entities/audit_logs';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async createAuditLog(user_id: number, timestamp: Date, manipulate: string, params: string): Promise<AuditLog> {
    const auditLogEntry = new AuditLog();
    auditLogEntry.user_id = user_id;
    auditLogEntry.timestamp = timestamp;
    auditLogEntry.manipulate = manipulate;
    auditLogEntry.params = params;

    try {
      return await this.entityManager.save(AuditLog, auditLogEntry);
    } catch (error) {
      console.error('Error writing audit log entry:', error);
      throw error; // Rethrow the error to be handled by the calling service
    }
  }
}