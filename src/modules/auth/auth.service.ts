import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'util/types';
import * as EmailValidator from 'email-validator';
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
    @InjectRepository(User) private readonly userRepository: UserRepository,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: AuditLogRepository,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateUserLogin(email: string, password: string): Promise<{ token?: string, error?: string, redirect?: string, status?: number, message?: string }> {
    if (!email || !password || !EmailValidator.validate(email)) {
      throw new BadRequestException('Email is required and must be a valid email address.');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { error: 'Incorrect login details', status: 401 };
    }

    switch (user.status) {
      case StatusEnum.LOCKED:
        return { error: 'Account is locked.', status: 401 };
      case StatusEnum.INVALID:
        return { error: 'Account is invalid.', status: 401 };
    }

    const passwordHash = bcrypt.hashSync(password, user.password_salt);
    if (passwordHash !== user.password_hash) {
      return { error: 'Incorrect login details', status: 401 };
    }

    const passwordExpired = user.password_last_changed && new Date() > new Date(user.password_last_changed);
    if (!user.password_last_changed || passwordExpired) {
      return { error: 'Password has expired, please reset your password.', status: 302 };
    }

    const token = this.jwtService.sign({ userId: user.id });
    user.remember_me_token = crypto.randomBytes(64).toString('hex');
    await this.userRepository.save(user);

    await this.writeAuditLogEntry(user.id, new Date(), 'LOGIN_SUCCESS', JSON.stringify({ email }));

    return { token, status: 200, message: 'Login successful.' };
  }

  async writeAuditLogEntry(userId: number, timestamp: Date, manipulate: string, params: string): Promise<{ status: number, message: string }> {
    // Validation: Check if user_id exists in 'users' table
    const userExists = await this.userRepository.findOne({ where: { id: userId } });
    if (!userExists) {
      throw new NotFoundException("User not found.");
    }

    // Validation: Check if timestamp is a valid datetime
    if (!isDate(timestamp)) {
      throw new BadRequestException("Invalid timestamp.");
    }

    // Validation: Check if manipulate is set to 'LOGIN_SUCCESS'
    if (manipulate !== 'LOGIN_SUCCESS') {
      throw new BadRequestException("Action for the log entry is required.");
    }

    // Validation: Check if params is a valid text
    if (typeof params !== 'string') {
      throw new BadRequestException("Invalid parameters.");
    }

    try {
      const auditLogEntry = new AuditLog();
      auditLogEntry.user_id = userId;
      auditLogEntry.timestamp = timestamp;
      auditLogEntry.manipulate = manipulate;
      auditLogEntry.params = params;

      await this.auditLogRepository.save(auditLogEntry);

      return { status: 201, message: 'Audit log entry written successfully.' };
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  // ... other methods in AuthService
}