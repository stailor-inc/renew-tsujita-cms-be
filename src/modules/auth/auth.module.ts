import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  // Add any providers or imports if necessary
})
export class AuthModule {}