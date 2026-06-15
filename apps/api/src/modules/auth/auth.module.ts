import { Module } from '@nestjs/common';
import { SessionAuthGuard } from '../../common/auth/guards/session-auth.guard';
import { AuditLogsRepository } from '../../infrastructure/database/repositories/audit-logs.repository';
import { AuthSessionsRepository } from '../../infrastructure/database/repositories/auth-sessions.repository';
import { OrganizationUsersRepository } from '../../infrastructure/database/repositories/organization-users.repository';
import { UsersRepository } from '../../infrastructure/database/repositories/users.repository';
import { AuthController } from './controllers/auth.controller';
import { AccessControlService } from './services/access-control.service';
import { AuthService } from './services/auth.service';
import { AuditService } from '../audit/services/audit.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessControlService,
    AuditService,
    UsersRepository,
    OrganizationUsersRepository,
    AuthSessionsRepository,
    AuditLogsRepository,
    SessionAuthGuard,
  ],
  exports: [
    AuthService,
    AccessControlService,
    AuditService,
    UsersRepository,
    OrganizationUsersRepository,
    AuthSessionsRepository,
    SessionAuthGuard,
  ],
})
export class AuthModule {}
