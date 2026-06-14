import { Injectable, NotFoundException } from '@nestjs/common';
import { PlatformStoreService } from '../../../common/platform/services/platform-store.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { OrganizationModel } from '../models/organization.model';
import { CreateOrganizationUseCase } from '../use-cases/create-organization.use-case';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly store: PlatformStoreService,
    private readonly createOrganizationUseCase: CreateOrganizationUseCase,
  ) {}

  findAll(): OrganizationModel[] {
    return this.store.organizations;
  }

  findOne(id: string): OrganizationModel {
    const organization = this.store.organizations.find((candidate) => candidate.id === id);

    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return organization;
  }

  create(payload: CreateOrganizationDto, ownerUserId: string): OrganizationModel {
    return this.createOrganizationUseCase.execute(payload, ownerUserId);
  }

  update(id: string, payload: UpdateOrganizationDto): OrganizationModel {
    const organization = this.findOne(id);

    Object.assign(organization, payload, {
      updatedAt: this.store.now(),
    });

    return organization;
  }
}
