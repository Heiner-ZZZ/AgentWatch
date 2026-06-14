import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { OrganizationModel } from '../models/organization.model';

@Injectable()
export class CreateOrganizationUseCase {
  constructor(private readonly store: PlatformStoreService) {}

  execute(payload: CreateOrganizationDto, ownerUserId: string): OrganizationModel {
    const user = this.store.users.find((candidate) => candidate.id === ownerUserId);

    if (!user) {
      throw new NotFoundException('Owner user not found.');
    }

    const now = this.store.now();
    const organization = {
      id: this.store.generateId(),
      name: payload.name,
      countryCode: payload.countryCode,
      timezone: payload.timezone,
      plan: payload.plan,
      status: payload.status,
      createdAt: now,
      updatedAt: now,
    };

    this.store.organizations.push(organization);
    this.store.memberships.push({
      id: this.store.generateId(),
      organizationId: organization.id,
      userId: ownerUserId,
      role: 'owner',
      createdAt: now,
    });

    return organization;
  }
}
