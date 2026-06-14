import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { AgentModel } from '../models/agent.model';

@Injectable()
export class CreateAgentUseCase {
  constructor(private readonly store: PlatformStoreService) {}

  execute(payload: CreateAgentDto): AgentModel {
    const organization = this.store.organizations.find(
      (candidate) => candidate.id === payload.organizationId,
    );

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    const now = this.store.now();
    const apiKey = this.store.generateToken('aw_agent');
    const agent = {
      id: this.store.generateId(),
      organizationId: payload.organizationId,
      name: payload.name,
      agentType: payload.agentType,
      source: payload.source,
      description: payload.description,
      autonomyLevel: payload.autonomyLevel,
      status: payload.status,
      apiKey,
      createdAt: now,
      updatedAt: now,
    };

    this.store.agents.push(agent);

    return {
      ...agent,
      apiKeyMasked: `${apiKey.slice(0, 12)}...`,
    };
  }
}
