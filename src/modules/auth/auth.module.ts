import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController], // AuthController is already included
  providers: [AuthService],
  // Add any imports if necessary
})
export class AuthModule {}