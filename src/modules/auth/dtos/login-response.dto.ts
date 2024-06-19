export class LoginResponseDto {
  @IsInt()
  status: number;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  session_token?: string;

  @IsString()
  @IsOptional()
  redirect?: string; // Redirection command to home page or password reset page if needed

  @IsString()
  @IsOptional()
  error?: string;

  @IsString()
  @IsOptional()
  token?: string;
}