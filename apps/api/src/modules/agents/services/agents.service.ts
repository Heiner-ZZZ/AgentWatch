import { Injectable, NotFoundException } from '@nestjs/common';
import { CredentialService } from '../../../common/security/services/credential.service';
import { AccessControlService } from '../../auth/services/access-control.service';
import { AuditService } from '../../audit/services/audit.service';
import { AgentsRepository } from '../../../infrastructure/database/repositories/agents.repository';
import { ApiKeysRepository } from '../../../infrastructure/database/repositories/api-keys.repository';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { AgentModel } from '../models/agent.model';
import { CreateAgentUseCase } from '../use-cases/create-agent.use-case';

@Injectable()
export class AgentsService {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
    private readonly agentsRepository: AgentsRepository,
    private readonly apiKeysRepository: ApiKeysRepository,
    private readonly credentialService: CredentialService,
    private readonly createAgentUseCase: CreateAgentUseCase,
  ) {}

  async findAll(userId: string): Promise<AgentModel[]> {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);
    const agents = await this.agentsRepository.findAllByOrganizationIds(organizationIds);

    return agents.map((agent) => ({
      id: agent.id,
      organizationId: agent.organizationId,
      name: agent.name,
      agentType: agent.agentType,
      source: agent.source ?? 'manual',
      description: agent.description ?? '',
      autonomyLevel: agent.autonomyLevel as
        | 'read_only'
        | 'supervised'
        | 'limited_write'
        | 'autonomous',
      status: agent.status as 'active' | 'inactive',
      apiKeyMasked: 'managed-in-db',
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
    }));
  }

  async findOne(id: string, userId: string): Promise<AgentModel> {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);
    const agent = await this.agentsRepository.findByIdForOrganizationIds(id, organizationIds);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    return {
      id: agent.id,
      organizationId: agent.organizationId,
      name: agent.name,
      agentType: agent.agentType,
      source: agent.source ?? 'manual',
      description: agent.description ?? '',
      autonomyLevel: agent.autonomyLevel as
        | 'read_only'
        | 'supervised'
        | 'limited_write'
        | 'autonomous',
      status: agent.status as 'active' | 'inactive',
      apiKeyMasked: 'managed-in-db',
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
    };
  }

  create(payload: CreateAgentDto, userId: string) {
    return this.createAgentUseCase.execute(payload, userId);
  }

  async update(id: string, payload: UpdateAgentDto, userId: string): Promise<AgentModel> {
    const before = await this.findOne(id, userId);
    await this.accessControlService.requireOrganizationRole(before.organizationId, userId, [
      'owner',
      'admin',
      'integrator',
    ]);
    const agent = await this.agentsRepository.update(id, payload);

    if (!agent) {
      throw new NotFoundException('Agent not found.');
    }

    await this.auditService.record({
      organizationId: agent.organizationId,
      actorUserId: userId,
      action: 'agent.updated',
      targetType: 'agent',
      targetId: id,
      beforeState: before,
      afterState: {
        name: agent.name,
        source: agent.source,
        description: agent.description,
        autonomyLevel: agent.autonomyLevel,
        status: agent.status,
      },
    });

    return {
      id: agent.id,
      organizationId: agent.organizationId,
      name: agent.name,
      agentType: agent.agentType,
      source: agent.source ?? 'manual',
      description: agent.description ?? '',
      autonomyLevel: agent.autonomyLevel as
        | 'read_only'
        | 'supervised'
        | 'limited_write'
        | 'autonomous',
      status: agent.status as 'active' | 'inactive',
      apiKeyMasked: 'managed-in-db',
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
    };
  }

  async rotateKey(id: string, userId: string) {
    const agent = await this.findOne(id, userId);
    await this.accessControlService.requireOrganizationRole(agent.organizationId, userId, [
      'owner',
      'admin',
      'integrator',
    ]);

    await this.apiKeysRepository.deactivateActiveKeyForAgent(id);
    const apiKey = this.credentialService.generateOpaqueToken('aw_agent');
    await this.apiKeysRepository.create({
      organizationId: agent.organizationId,
      agentId: agent.id,
      keyPrefix: this.credentialService.getKeyPrefix(apiKey),
      keyHash: this.credentialService.hashValue(apiKey),
    });

    await this.auditService.record({
      organizationId: agent.organizationId,
      actorUserId: userId,
      action: 'agent.key_rotated',
      targetType: 'agent',
      targetId: id,
      afterState: {
        keyPrefix: this.credentialService.getKeyPrefix(apiKey),
      },
    });

    return {
      id: agent.id,
      organizationId: agent.organizationId,
      apiKey,
      rotatedAt: new Date().toISOString(),
    };
  }
}
