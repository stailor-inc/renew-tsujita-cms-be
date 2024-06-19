import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuditLogRepository } from 'src/repositories/audit-logs.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuditLogRepository],
  // Add any imports if necessary
})
export class AuthModule {}