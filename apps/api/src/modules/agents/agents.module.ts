import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AgentsController } from './controllers/agents.controller';
import { AgentsService } from './services/agents.service';
import { CreateAgentUseCase } from './use-cases/create-agent.use-case';

@Module({
  imports: [AuthModule],
  controllers: [AgentsController],
  providers: [AgentsService, CreateAgentUseCase],
})
export class AgentsModule {}
