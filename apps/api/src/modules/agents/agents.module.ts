import { Module } from '@nestjs/common';
import { AgentsRepository } from '../../infrastructure/database/repositories/agents.repository';
import { ApiKeysRepository } from '../../infrastructure/database/repositories/api-keys.repository';
import { OrganizationsRepository } from '../../infrastructure/database/repositories/organizations.repository';
import { AuthModule } from '../auth/auth.module';
import { AgentsController } from './controllers/agents.controller';
import { AgentsService } from './services/agents.service';
import { CreateAgentUseCase } from './use-cases/create-agent.use-case';

@Module({
  imports: [AuthModule],
  controllers: [AgentsController],
  providers: [
    AgentsService,
    CreateAgentUseCase,
    AgentsRepository,
    ApiKeysRepository,
    OrganizationsRepository,
  ],
})
export class AgentsModule {}
