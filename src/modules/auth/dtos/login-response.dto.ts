export class LoginResponseDto {
  status: number;
  message: string;
  session_token?: string;
  redirect?: string; // Redirection command to home page or password reset page if needed
  error?: string;
  token?: string;
}