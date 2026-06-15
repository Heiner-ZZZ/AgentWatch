import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../../audit/services/audit.service';
import { OrganizationUsersRepository } from '../../../infrastructure/database/repositories/organization-users.repository';
import { OrganizationsRepository } from '../../../infrastructure/database/repositories/organizations.repository';
import { UsersRepository } from '../../../infrastructure/database/repositories/users.repository';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationModel } from '../models/organization.model';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(
    private readonly auditService: AuditService,
    private readonly usersRepository: UsersRepository,
    private readonly organizationsRepository: OrganizationsRepository,
    private readonly organizationUsersRepository: OrganizationUsersRepository,
  ) {}

  async execute(
    payload: CreateOrganizationDto,
    ownerUserId: string,
  ): Promise<OrganizationModel> {
    const user = await this.usersRepository.findById(ownerUserId);

    if (!user) {
      throw new NotFoundException('Owner user not found.');
    }

    const organization = await this.organizationsRepository.create({
      name: payload.name,
      countryCode: payload.countryCode,
      timezone: payload.timezone,
      plan: payload.plan,
      status: payload.status,
    });

    await this.organizationUsersRepository.createMembership({
      organizationId: organization.id,
      userId: ownerUserId,
      role: 'owner',
    });

    await this.auditService.record({
      organizationId: organization.id,
      actorUserId: ownerUserId,
      action: 'organization.created',
      targetType: 'organization',
      targetId: organization.id,
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
