import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/users.repository';
import { User, StatusEnum } from 'src/entities/users';
import { AuditLog } from 'src/entities/audit_logs';
import { AuditLogRepository } from 'src/repositories/audit-logs.repository';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto'; // Imported LoginDto
import { LoginResponseDto } from './dtos/login-response.dto'; // Imported LoginResponseDto

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: AuditLogRepository,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateUserLogin(loginDto: LoginDto): Promise<LoginResponseDto> {
    if (!loginDto.email || !loginLoginDto.password) {
      throw new BadRequestException('Email and password must not be empty');
    }

    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      return { error: 'Incorrect login details' };
    } else if (user.status === StatusEnum.LOCKED) {
      return { error: 'Account is locked' };
    } else if (user.status === StatusEnum.INVALID) {
      return { error: 'Account is invalid' };
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect login details');
    }

    const currentDate = new Date();
    if (user.password_last_changed && currentDate > user.password_last_changed) {
      return { redirect: 'password-reset' };
    }

    if (!user.password_last_changed || user.password_last_changed.getTime() === user.created_at.getTime()) {
      return { redirect: 'password-reset' };
    }

    const token = this.jwtService.sign({ userId: user.id });
    user.remember_me_token = crypto.randomBytes(64).toString('hex');
    await this.userRepository.save(user);

    await this.writeAuditLogEntry(user.id, new Date(), 'LOGIN_SUCCESS', JSON.stringify({ email: loginDto.email }));

    return { token };
  }

  async writeAuditLogEntry(userId: number, timestamp: Date, manipulate: string, params: string): Promise<string> {
    const auditLogEntry = new AuditLog();
    auditLogEntry.user_id = userId;
    auditLogEntry.timestamp = timestamp;
    auditLogEntry.manipulate = manipulate;
    auditLogEntry.params = params;

    await this.auditLogRepository.save(auditLogEntry);

    return 'Audit log entry written successfully';
  }

  // ... other methods in AuthService
}