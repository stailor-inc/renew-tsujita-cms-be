import { Body, Controller, HttpCode, HttpStatus, Post, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AuditLogEntryDto } from './dtos/audit-log-entry.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // ... existing login method code
  }

  @Post('/audit_logs')
  async writeAuditLog(@Body() auditLogEntryDto: AuditLogEntryDto): Promise<{ status: number; message: string }> {
    try {
      const { user_id, timestamp, manipulate, params } = auditLogEntryDto;

      // Validate user_id exists in users table
      const userExists = await this.authService.validateUserExists(user_id);
      if (!userExists) {
        throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
      }

      // Validate timestamp is a valid datetime
      if (isNaN(Date.parse(timestamp))) {
        throw new HttpException("Invalid timestamp.", HttpStatus.BAD_REQUEST);
      }

      // Validate manipulate is required and set to 'LOGIN_SUCCESS'
      if (manipulate !== 'LOGIN_SUCCESS') {
        throw new HttpException("Action for the log entry is required.", HttpStatus.BAD_REQUEST);
      }

      // Validate params is a valid text
      if (typeof params !== 'string') {
        throw new HttpException("Invalid parameters.", HttpStatus.BAD_REQUEST);
      }

      // Write the audit log entry
      await this.authService.writeAuditLogEntry(user_id, new Date(timestamp), manipulate, params);

      return {
        status: HttpStatus.CREATED,
        message: "Audit log entry written successfully."
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("An unexpected error has occurred on the server.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}