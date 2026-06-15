import { Injectable, NotFoundException } from '@nestjs/common';
import { AccessControlService } from '../../auth/services/access-control.service';
import { AuditService } from '../../audit/services/audit.service';
import { OrganizationsRepository } from '../../../infrastructure/database/repositories/organizations.repository';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationModel } from '../models/organization.model';
import { CreateOrganizationUseCase } from '../use-cases/create-organization.use-case';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly accessControlService: AccessControlService,
    private readonly auditService: AuditService,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
  ) {}

  async findAll(userId: string): Promise<OrganizationModel[]> {
    const organizationIds = await this.accessControlService.getOrganizationIdsForUser(userId);
    const organizations = await this.organizationsRepository.findAllByIds(organizationIds);

    return organizations.map((organization) => ({
      id: organization.id,
      name: organization.name,
      countryCode: organization.countryCode,
      timezone: organization.timezone,
      plan: organization.plan,
      status: organization.status as 'active' | 'inactive',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    }));
  }

  async findOne(id: string, userId: string): Promise<OrganizationModel> {
    await this.accessControlService.requireOrganizationMembership(id, userId);
    const organization = await this.organizationsRepository.findById(id);

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return {
      id: organization.id,
      name: organization.name,
      countryCode: organization.countryCode,
      timezone: organization.timezone,
      plan: organization.plan,
      status: organization.status as 'active' | 'inactive',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }

  create(payload: CreateOrganizationDto, ownerUserId: string) {
    return this.createOrganizationUseCase.execute(payload, ownerUserId);
  }

  async update(id: string, payload: UpdateOrganizationDto, userId: string): Promise<OrganizationModel> {
    await this.accessControlService.requireOrganizationRole(id, userId, ['owner', 'admin']);
    const before = await this.findOne(id, userId);
    const organization = await this.organizationsRepository.update(id, payload);

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    await this.auditService.record({
      organizationId: id,
      actorUserId: userId,
      action: 'organization.updated',
      targetType: 'organization',
      targetId: id,
      beforeState: before,
      afterState: {
        name: organization.name,
        countryCode: organization.countryCode,
        timezone: organization.timezone,
        plan: organization.plan,
        status: organization.status,
      },
    });

    return {
      id: organization.id,
      name: organization.name,
      countryCode: organization.countryCode,
      timezone: organization.timezone,
      plan: organization.plan,
      status: organization.status as 'active' | 'inactive',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }
}
