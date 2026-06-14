import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { AgentModel } from '../models/agent.model';
import { CreateAgentUseCase } from '../use-cases/create-agent.use-case';

@Injectable()
export class AgentsService {
  constructor(
    private readonly store: PlatformStoreService,
    private readonly createAgentUseCase: CreateAgentUseCase,
  ) {}

  findAll(): AgentModel[] {
    return this.store.agents.map((agent) => ({
      ...agent,
      apiKeyMasked: `${agent.apiKey.slice(0, 12)}...`,
    }));
  }

  findOne(id: string) {
    const agent = this.store.agents.find((candidate) => candidate.id === id);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    return {
      ...agent,
      apiKeyMasked: `${agent.apiKey.slice(0, 12)}...`,
    };
  }

  create(payload: CreateAgentDto) {
    return this.createAgentUseCase.execute(payload);
  }

  update(id: string, payload: UpdateAgentDto) {
    const agent = this.store.agents.find((candidate) => candidate.id === id);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    Object.assign(agent, payload, {
      updatedAt: this.store.now(),
    });

    return {
      ...agent,
      apiKeyMasked: `${agent.apiKey.slice(0, 12)}...`,
    };
  }

  rotateKey(id: string) {
    const agent = this.store.agents.find((candidate) => candidate.id === id);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    agent.apiKey = this.store.generateToken('aw_agent');
    agent.updatedAt = this.store.now();

    return {
      id: agent.id,
      organizationId: agent.organizationId,
      apiKey: agent.apiKey,
      rotatedAt: agent.updatedAt,
    };
  }
}
