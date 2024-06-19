import { Body, Controller, HttpCode, HttpStatus, Post, HttpException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuditLogEntryDto } from './dtos/audit-log-entry.dto';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const { token, error, redirect } = await this.authService.authenticateUserLogin(email, password);

    const response = new LoginResponseDto();

    if (error) {
      response.error = error;
      if (error === 'Account is locked' || error === 'Account is invalid') {
        throw new HttpException({ status: HttpStatus.UNAUTHORIZED, error: error }, HttpStatus.UNAUTHORIZED);
      } else if (error === 'Incorrect login details') {
        throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: error }, HttpStatus.BAD_REQUEST);
      }
    } else if (redirect) {
      response.redirect = redirect;
      throw new HttpException({ status: HttpStatus.FOUND, redirect: redirect }, HttpStatus.FOUND);
    } else if (token) {
      response.token = token;
      response.message = 'Login successful.';
    } else {
      throw new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: 'An unexpected error has occurred' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return response;
  }

  @Post('/audit_logs')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  async writeAuditLog(@Body() auditLogEntryDto: AuditLogEntryDto): Promise<{ status: number; message: string }> {
    const { user_id, timestamp, manipulate, params } = auditLogEntryDto;

    if (!user_id || !await this.authService.userRepository.findOne({ where: { id: user_id } })) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: "User not found." }, HttpStatus.BAD_REQUEST);
    }

    if (!timestamp || isNaN(Date.parse(timestamp))) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: "Invalid timestamp." }, HttpStatus.BAD_REQUEST);
    }

    if (manipulate !== 'LOGIN_SUCCESS') {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: "Action for the log entry is required." }, HttpStatus.BAD_REQUEST);
    }

    if (typeof params !== 'string') {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: "Invalid parameters." }, HttpStatus.BAD_REQUEST);
    }

    await this.authService.writeAuditLogEntry(user_id, new Date(timestamp), manipulate, params);
    return { status: HttpStatus.CREATED, message: "Audit log entry written successfully." };
  }
}