import { Module } from '@nestjs/common';
import { AgentApiKeyGuard } from '../../common/auth/guards/agent-api-key.guard';
import { SessionAuthGuard } from '../../common/auth/guards/session-auth.guard';
import { AgentsRepository } from '../../infrastructure/database/repositories/agents.repository';
import { ApiKeysRepository } from '../../infrastructure/database/repositories/api-keys.repository';
import { EventsRepository } from '../../infrastructure/database/repositories/events.repository';
import { OrganizationUsersRepository } from '../../infrastructure/database/repositories/organization-users.repository';
import { ApprovalsModule } from '../approvals/approvals.module';
import { AuthModule } from '../auth/auth.module';
import { EventsController } from './controllers/events.controller';
import { BusinessSummaryService } from './services/business-summary.service';
import { EventsService } from './services/events.service';
import { RiskClassificationService } from './services/risk-classification.service';
import { CreateEventUseCase } from './use-cases/create-event.use-case';

@Module({
  imports: [AuthModule, ApprovalsModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    CreateEventUseCase,
    BusinessSummaryService,
    RiskClassificationService,
    EventsRepository,
    OrganizationUsersRepository,
    AgentsRepository,
    ApiKeysRepository,
    AgentApiKeyGuard,
    SessionAuthGuard,
  ],
})
export class EventsModule {}
