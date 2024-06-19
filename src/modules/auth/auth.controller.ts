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
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> | never {
    // ... existing login method code
    throw new HttpException('Method not implemented.', HttpStatus.NOT_IMPLEMENTED);
  }

  @Post('/audit_logs')
  async writeAuditLog(@Body() auditLogEntryDto: AuditLogEntryDto): Promise<{ status: number; message: string }> {
    try {
      const { user_id, timestamp: rawTimestamp, manipulate, params } = auditLogEntryDto;
      const userExists = await this.authService.userExists(user_id); // Assuming this is the correct method
      if (!userExists) {
        throw new HttpException("User not found.", HttpStatus.BAD_REQUEST);
      }

      // Validate timestamp is a valid datetime
      let timestamp = new Date(rawTimestamp);
      if (isNaN(timestamp.getTime())) {
        throw new HttpException("Invalid timestamp.", HttpStatus.BAD_REQUEST);
      }

      // Validate manipulate is required and set to 'LOGIN_SUCCESS'
      if (manipulate !== 'LOGIN_SUCCESS') {
        throw new HttpException("Action for the log entry is required.", HttpStatus.BAD_REQUEST);
      }

      // Assuming params is already a string as per DTO validation
      if (typeof params !== 'string') {
        throw new HttpException("Invalid parameters.", HttpStatus.BAD_REQUEST);
      }

      // Write the audit log entry
      await this.authService.writeAuditLogEntry(user_id, timestamp, manipulate, params);

      return { // Fixed missing return object
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