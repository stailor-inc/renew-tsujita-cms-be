export class LoginResponseDto {
  status: number;
  message: string;
  session_token?: string;
  redirect?: string; // Redirection command to home page or password reset page if needed
  failedLoginAttempts?: number; // Number of failed login attempts
  error?: string;
  token?: string;
  // Optional properties for account lock handling
  accountLocked?: boolean; // Indicates if the account is locked
}