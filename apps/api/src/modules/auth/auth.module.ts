import { Module } from '@nestjs/common';
import { SessionAuthGuard } from '../../common/auth/guards/session-auth.guard';
import { PlatformStoreService } from '../../common/platform/services/platform-store.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PlatformStoreService, SessionAuthGuard],
  exports: [AuthService, PlatformStoreService, SessionAuthGuard],
})
export class AuthModule {}
