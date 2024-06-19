import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Added from patch
import { UserRepository } from 'src/repositories/users.repository';
import { User, StatusEnum } from 'src/entities/users';
import { AuditLog } from 'src/entities/audit_logs';
import { AuditLogRepository } from 'src/repositories/audit-logs.repository';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: AuditLogRepository,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateUserLogin(email: string, password: string): Promise<{ token?: string, error?: string, redirect?: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password must not be empty');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { error: 'Incorrect login details' };
    }

    switch (user.status) {
      case StatusEnum.LOCKED:
        return { error: 'Account is locked' };
      case StatusEnum.INVALID:
        return { error: 'Account is invalid' };
    }

    const passwordHash = bcrypt.hashSync(password, user.password_salt);
    if (passwordHash !== user.password_hash) {
      return { error: 'Incorrect login details' };
    }

    const currentDate = new Date();
    if (user.password_last_changed && currentDate > user.password_last_changed) {
      return { redirect: 'password-reset' };
    }

    if (!user.password_last_changed || user.password_last_changed === user.created_at) {
      return { redirect: 'password-reset' };
    }

    const token = this.jwtService.sign({ userId: user.id });
    user.remember_me_token = crypto.randomBytes(64).toString('hex');
    await this.userRepository.save(user);

    await this.writeAuditLogEntry(user.id, new Date(), 'LOGIN_SUCCESS', JSON.stringify({ email }));

    return { token };
  }

  async writeAuditLogEntry(userId: number, timestamp: Date, manipulate: string, params: string): Promise<AuditLog> { // Return type changed from string to AuditLog
    try {
      const auditLogEntry = new AuditLog();
      auditLogEntry.user_id = userId;
      auditLogEntry.timestamp = timestamp;
      auditLogEntry.manipulate = manipulate;
      auditLogEntry.params = params;

      const savedAuditLogEntry = await this.auditLogRepository.save(auditLogEntry); // Changed to save and return the entry

      return savedAuditLogEntry; // Changed to return the saved entry
    } catch (error) {
      console.error('Failed to write audit log entry:', error);
      throw new BadRequestException('Failed to write audit log entry');
    }
  }

  // ... other methods in AuthService
}