import { Body, Controller, HttpCode, HttpStatus, Post, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

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
      if (error === 'Account is locked') {
        throw new HttpException({ status: HttpStatus.UNAUTHORIZED, error: error }, HttpStatus.UNAUTHORIZED);
      } else if (error === 'Account has been locked due to multiple failed login attempts.') {
        throw new HttpException({ status: HttpStatus.TOO_MANY_REQUESTS, error: error }, HttpStatus.TOO_MANY_REQUESTS);
      } else if (error === 'Incorrect login details') {
        throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: error }, HttpStatus.BAD_REQUEST);
      } else if (error === 'Password has expired, please reset your password.') {
        throw new HttpException({ status: HttpStatus.FOUND, redirect: 'password-reset' }, HttpStatus.FOUND);
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
}