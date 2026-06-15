import { Module } from '@nestjs/common';
import { ApprovalsRepository } from '../../infrastructure/database/repositories/approvals.repository';
import { EventsRepository } from '../../infrastructure/database/repositories/events.repository';
import { AuthModule } from '../auth/auth.module';
import { ApprovalsController } from './controllers/approvals.controller';
import { ApprovalsService } from './services/approvals.service';

@Module({
  imports: [AuthModule],
  controllers: [ApprovalsController],
  providers: [ApprovalsService, ApprovalsRepository, EventsRepository],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
