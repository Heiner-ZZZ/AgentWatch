import { Injectable, NotFoundException } from '@nestjs/common';
import { CredentialService } from '../../../common/security/services/credential.service';
import { AccessControlService } from '../../auth/services/access-control.service';
import { AuditService } from '../../audit/services/audit.service';
import { AgentsRepository } from '../../../infrastructure/database/repositories/agents.repository';
import { ApiKeysRepository } from '../../../infrastructure/database/repositories/api-keys.repository';
import { OrganizationsRepository } from '../../../infrastructure/database/repositories/organizations.repository';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { AgentModel } from '../models/agent.model';

@Injectable()
export class CreateAgentUseCase {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly agentsRepository: AgentsRepository,
    private readonly apiKeysRepository: ApiKeysRepository,
    private readonly credentialService: CredentialService,
  ) {}

  async execute(payload: CreateAgentDto, userId: string): Promise<AgentModel & { apiKey: string }> {
    const organization = await this.organizationsRepository.findById(payload.organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    await this.accessControlService.requireOrganizationRole(payload.organizationId, userId, [
      'owner',
      'admin',
      'integrator',
    ]);

    const agent = await this.agentsRepository.create({
      organizationId: payload.organizationId,
      name: payload.name,
      agentType: payload.agentType,
      source: payload.source,
      description: payload.description,
      autonomyLevel: payload.autonomyLevel,
      status: payload.status,
    });

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
      action: 'agent.created',
      targetType: 'agent',
      targetId: agent.id,
      afterState: {
        name: agent.name,
        agentType: agent.agentType,
        source: agent.source,
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
      apiKeyMasked: this.credentialService.getMaskedToken(apiKey),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      apiKey,
    };
  }
}
