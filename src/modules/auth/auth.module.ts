import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
+ import { TypeOrmModule } from '@nestjs/typeorm';
+ import { User } from 'src/entities/users.ts';
+ import { AuditLog } from 'src/entities/audit_logs.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuditLog])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}